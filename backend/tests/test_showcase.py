from sqlalchemy import select, func
from app.seed_showcase import seed_showcase
from app.models import CaseRecord, Attachment, CoordinationGroup, Resolution
from conftest import signin

def test_showcase_is_additive_repeatable_and_visible_to_demo_roles(system, client):
    with system.state.sessions() as db:
        original={c.id:(c.subject,c.version,c.current_owner_id) for c in db.scalars(select(CaseRecord))}
    created=seed_showcase(system.state.settings,system.state.sessions)
    assert len(created)==36
    assert seed_showcase(system.state.settings,system.state.sessions)==[]
    with system.state.sessions() as db:
        assert db.scalar(select(func.count(Attachment.id)))>=54
        assert db.scalar(select(func.count(CoordinationGroup.id)))>=6
        assert db.scalar(select(func.count(Resolution.id)))>=6
        for key,value in original.items():
            c=db.get(CaseRecord,key)
            assert (c.subject,c.version,c.current_owner_id)==value
    for role in ['rb','pgrc','coordinator','management','supervisor','admin']:
        signin(client,role+'@demo.test')
        listing=client.get('/api/cases').json()
        assert len([c for c in listing['items'] if c['id'].startswith('SIH-')])==36
        groups=client.get('/api/coordination').json()
        assert len([g for g in groups if g['institution_id'].startswith('SIH-')])==6
        case=client.get('/api/cases/SIH-01-001').json()
        assert len(case['attachments'])==2
        assert client.get(case['attachments'][0]['download_url']).status_code==200
