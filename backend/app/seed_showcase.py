"""Additive, repeatable SIH recording scenario. Never rewrites existing records."""
import hashlib
import json
from datetime import timedelta
from pathlib import Path
from sqlalchemy import select
from .config import Settings, ROOT
from .database import make_database
from .seed import seed
from .models import (User, Institution, CaseRecord, Assignment, OriginalSubmission, Complainant,
    WorkflowEvent, Attachment, AccessGrant, CapabilityGrant, CoordinationGroup, GroupReview,
    RelationshipDecision, Transfer, Notification, AdministrativeEvent, Resolution, new_id, now)
from .coordination import refresh_coordination, make_suggestion
from .storage import Evidence, store

INSTITUTIONS = [
    ("SIH-INST-01", "Sahyadri Technical Institute (Fictional)", "Pune", "DEMO-WEST"),
    ("SIH-INST-02", "Vidarbha College of Engineering (Fictional)", "Nagpur", "DEMO-WEST"),
    ("SIH-INST-03", "Aravalli Institute of Technology (Fictional)", "Jaipur", "DEMO-NORTH"),
    ("SIH-INST-04", "Kaveri Technical Campus (Fictional)", "Bengaluru", "DEMO-SOUTH"),
    ("SIH-INST-05", "Utkal Engineering Academy (Fictional)", "Bhubaneswar", "DEMO-EAST"),
    ("SIH-INST-06", "Malabar Institute of Applied Science (Fictional)", "Kozhikode", "DEMO-SOUTH"),
]
SCENARIOS = [
    ("Admission cancellation — refund pending", "FEE_REFUND", "The student cancelled admission within the institution's published window. The accounts desk acknowledged the request, but the refund has not reached the student. Compare the acknowledgement and payment ledger before requesting a response.", "Obtain accounts reconciliation and communicate the refund timeline", "UNDER_REVIEW"),
    ("Fee refund acknowledgement requires clarification", "FEE_REFUND", "A grievance references the same admission-cancellation batch as the regulation review. The acknowledgement lists a different processing date. Review both submissions before determining whether the complaints are related.", "Compare receipt references with the Regulation Bureau", "AWAITING_INFORMATION"),
    ("Laboratory equipment compliance follow-up", "INFRASTRUCTURE", "The institution supplied an equipment inventory after a compliance query. The inspection checklist is missing calibration dates for two laboratory instruments. Request the supporting calibration records.", "Review the revised laboratory inventory", "ASSIGNED"),
    ("Transfer certificate not issued after withdrawal", "OTHER", "The student requested a transfer certificate following withdrawal. The student helpdesk confirmed receipt but the certificate remains pending. The institution must clarify which clearance is outstanding.", "Seek an institution response on the pending certificate", "RECEIVED"),
    ("Scholarship document correction completed", "OTHER", "The student reported a spelling mismatch in the scholarship verification document. The institution supplied a corrected document and the student acknowledged receipt. This fictional case demonstrates a completed resolution.", "Resolution communicated; retain the acknowledgement", "DISPOSED"),
    ("Faculty service certificate verification", "FACULTY_GRIEVANCE", "A faculty member requested verification of service dates for a certificate. Two departmental records show different joining dates. Compare the documents and seek clarification before concluding the review.", "Reconcile service dates with the institution registrar", "UNDER_REVIEW"),
]

def seed_showcase(settings, sessions):
    if settings.environment not in {"demo", "test"}:
        raise RuntimeError("Showcase data is available only in demo/test environments")
    seed(settings, sessions)
    created = []
    with sessions() as db:
        users = {u.username:u for u in db.scalars(select(User))}
        reviewer = users['coordinator@demo.test']
        timestamp = now()
        for index,(iid,name,city,region) in enumerate(INSTITUTIONS):
            if not db.get(Institution,iid):
                db.add(Institution(id=iid,name=name,city=city,region_id=region,synthetic=True))
        db.flush()
        for index,(iid,name,city,region) in enumerate(INSTITUTIONS):
            for j,(subject,category,description,next_action,lifecycle) in enumerate(SCENARIOS):
                public_id=f"SIH-{index+1:02d}-{j+1:03d}"
                if db.scalar(select(CaseRecord.id).where(CaseRecord.public_id==public_id)):
                    continue
                bureau='RB' if j in (0,2,4) else 'PGRC'
                account='rb@demo.test' if bureau=='RB' else 'pgrc@demo.test'
                owner=users[account]
                received=timestamp-timedelta(days=12+index-j)
                due=timestamp+timedelta(days=(-2 if j==0 else j+1))
                facts={'incident_reference':f'DEMO-BATCH-{index+1:02d}', 'receipt_reference':f'DEMO-RECEIPT-{index+1:02d}' if j<2 else '', 'amount':'25000' if j<2 else '', 'remedy':next_action}
                case=CaseRecord(id=new_id(),public_id=public_id,institution_id=iid,original_institution_text=name+', '+city,
                    received_at=received,subject=subject,description=description,category=category,lifecycle=lifecycle,
                    current_owner_id=owner.id,current_bureau_id=bureau,next_action=next_action,due_at=due,
                    last_action='Resolution recorded' if lifecycle=='DISPOSED' else 'Documents reviewed' if j==0 else 'Case registered',
                    last_action_at=timestamp-timedelta(hours=2+j),facts=facts,synthetic=True,created_at=received)
                db.add(case);db.flush();created.append(public_id)
                payload={'id':public_id,'subject':subject,'description':description,'institution':iid,'facts':facts,'synthetic':True,'scenario':'SIH video showcase'}
                encoded=json.dumps(payload,sort_keys=True,ensure_ascii=False).encode()
                db.add_all([OriginalSubmission(case_id=case.id,payload=payload,sha256=hashlib.sha256(encoded).hexdigest(),created_at=received),
                    Complainant(case_id=case.id,synthetic_token=f'DEMO-SIH-{index+1:02d}-{j+1:03d}'),
                    Assignment(case_id=case.id,owner_id=owner.id,bureau_id=bureau,assigned_by=owner.id,reason='SIH showcase initial assignment',effective_from=received),
                    WorkflowEvent(case_id=case.id,event_type='SYNTHETIC_SEED',actor_id=owner.id,reason='Authored fictional SIH demonstration scenario; not a real complaint',before_version=0,after_version=1,occurred_at=received)])
                text=f'SYNTHETIC SIH DEMO — NOT REAL EVIDENCE\nCase: {public_id}\nInstitution: {name}, {city}\nSubject: {subject}\n\n{description}\n\nNext step: {next_action}\nReceipt reference: {facts["receipt_reference"] or "Not applicable"}\n\nPrepared solely for software demonstration.\n'
                evidence=[(f'{public_id}-case-note.txt',text.encode(),'text/plain')]
                if j in (0,1,3):
                    filename='hindi-letter.png' if j<2 else 'marathi-letter.png'
                    path=ROOT/'frontend/public/demo-attachments'/filename
                    if path.exists():evidence.append((f'{public_id}-{filename}',path.read_bytes(),'image/png'))
                for filename,content,mime in evidence:
                    digest=hashlib.sha256(content).hexdigest()
                    key,_=store(settings,Evidence(filename,content,mime,digest))
                    db.add(Attachment(case_id=case.id,storage_key=key,original_filename=filename,detected_type=mime,size=len(content),sha256=digest,created_by=owner.id,verified_at=timestamp))
                # Explicit read-only showcase delegation: never modify role memberships.
                for username in ['rb@demo.test','pgrc@demo.test','coordinator@demo.test','management@demo.test','supervisor@demo.test','admin@demo.test']:
                    for kind in ['M','N','A']+(['I'] if username=='coordinator@demo.test' else []):
                        db.add(AccessGrant(user_id=users[username].id,case_id=case.id,data_class=kind,granted_by=users['supervisor@demo.test'].id,reason='Explicit read access to fictional SIH showcase records only'))
                if j==2:
                    target=users['pgrc@demo.test']
                    db.add(Transfer(case_id=case.id,source_owner_id=owner.id,source_bureau_id=bureau,requester_id=owner.id,target_owner_id=target.id,target_bureau_id='PGRC',reason='Route student-facing clarification to the grievance desk after technical review',expires_at=timestamp+timedelta(days=7)))
        for iid,*_ in INSTITUTIONS:
            for capability in ['CASE_METADATA','COORDINATE','REVIEW_PAIR','IDENTITY']:
                if not db.scalar(select(CapabilityGrant.id).where(CapabilityGrant.user_id==reviewer.id,CapabilityGrant.capability==capability,CapabilityGrant.scope_type=='INSTITUTION',CapabilityGrant.scope_id==iid)):
                    db.add(CapabilityGrant(user_id=reviewer.id,capability=capability,scope_type='INSTITUTION',scope_id=iid,reason='Explicit fictional SIH showcase coordinator delegation'))
        db.flush();refresh_coordination(db)
        for index,(iid,*_) in enumerate(INSTITUTIONS):
            group=db.scalar(select(CoordinationGroup).where(CoordinationGroup.institution_id==iid))
            if not db.scalar(select(GroupReview.id).where(GroupReview.group_id==group.id,GroupReview.action=='SIH_SHOWCASE_PLAN')):
                group.lead_id=reviewer.id;group.lead_bureau_id='RB';group.state='PLANNED' if index%2==0 else 'IN_REVIEW'
                group.next_action='RB to reconcile records; PGRC to obtain the institution response; coordinator to review evidence before linking complaints.'
                group.due_at=timestamp+timedelta(days=index+2);group.version+=1
                db.add(GroupReview(group_id=group.id,actor_id=reviewer.id,action='SIH_SHOWCASE_PLAN',reason='Authored fictional cross-bureau plan for SIH recording',payload={'milestones':['Evidence reconciliation','Institution response','Joint review']},version=group.version))
            pair=[db.scalar(select(CaseRecord).where(CaseRecord.public_id==f'SIH-{index+1:02d}-{j:03d}')) for j in (1,2)]
            suggestion=make_suggestion(db,*pair,method='HUMAN_SOURCE_REVIEW',label='RELATED',evidence={'supporting':['Shared fictional receipt reference and cancellation batch'],'conflicting':['Different acknowledgement dates'],'missing':['Institution reconciliation pending']})
            if index%2==0 and not db.scalar(select(RelationshipDecision.id).where(RelationshipDecision.suggestion_id==suggestion.id)):
                db.add(RelationshipDecision(suggestion_id=suggestion.id,action='CONFIRM',label='RELATED',reason='Authored demo review: common receipt batch connects the issues; separate complaints and owners retained.',actor_id=reviewer.id,suggestion_version=suggestion.version))
            for username in ['rb@demo.test','pgrc@demo.test','coordinator@demo.test','management@demo.test','supervisor@demo.test','admin@demo.test']:
                key=f'SIH_SHOWCASE:{username}:{iid}'
                if not db.scalar(select(Notification.id).where(Notification.dedup_key==key)):
                    db.add(Notification(user_id=users[username].id,group_id=group.id,kind='COORDINATION',title=f'Joint review scheduled: {iid}',dedup_key=key,policy_version=1,state='DELIVERED',delivered_at=timestamp))
        db.flush()
        for case in db.scalars(select(CaseRecord).where(CaseRecord.public_id.like('SIH-%'),CaseRecord.lifecycle=='DISPOSED')):
            if not db.scalar(select(Resolution.id).where(Resolution.case_id==case.id)):
                db.add(Resolution(case_id=case.id,resolution='Corrected scholarship document supplied; acknowledgement recorded in the fictional demo case note.',evidence_ids=list(db.scalars(select(Attachment.id).where(Attachment.case_id==case.id))),actor_id=case.current_owner_id,disposed_at=case.last_action_at,case_version=case.version))
        if created:db.add(AdministrativeEvent(actor_id=users['admin@demo.test'].id,kind='SIH_SHOWCASE',reason='Added fictional SIH recording scenarios without resetting existing data',payload={'created_cases':created}))
        db.commit()
    return created

if __name__=='__main__':
    settings=Settings.from_env();_,sessions=make_database(settings)
    print(json.dumps({'created_cases':seed_showcase(settings,sessions)},indent=2))
