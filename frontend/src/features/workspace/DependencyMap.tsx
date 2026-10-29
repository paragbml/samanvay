import { useState } from "react";
import { PageHeading, Icon } from "../../shared/ui";
import { useResource } from "../../shared/useResource";
import { words } from "../../presentation";
import type { InstitutionConnection } from "./connection-model";
import "../../design-system/dependency-map.css";

type Node = { id: string; title: string; status: string; unit: string; detail: string; href?: string };
type Pair = {id:string;left:string;right:string;proposed_label:string;stale:boolean;decisions:{action:string;label:string|null;reason:string}[]};
type CaseSummary = {id:string;subject:string};
type Edge = { from: string; to: string; label: string; review: boolean; detail: string };
const samples: Node[] = [
  {id:"DEMO-01", title:"Application review delay",status:"Under scrutiny",unit:"Regional scrutiny cell",detail:"An illustrative application is awaiting document review."},
  {id:"DEMO-02", title:"Missing compliance documents",status:"Awaiting institution",unit:"Compliance desk",detail:"The institution has been asked to supply missing documents."},
  {id:"DEMO-03", title:"Faculty information verification",status:"In progress",unit:"Regional scrutiny cell",detail:"A separate verification case. A suggested connection needs human review."},
  {id:"DEMO-04", title:"Approval condition follow-up",status:"Pending review",unit:"Monitoring unit",detail:"Follow-up on an approval condition; ownership remains with this case's officer."},
  {id:"DEMO-05", title:"Renewal documentation check",status:"Open",unit:"Compliance desk",detail:"An illustrative renewal check linked to a documentation issue."},
];
const exampleEdges: Edge[] = [
  {from:"DEMO-01",to:"DEMO-02",label:"Suggested",review:true,detail:"Similar document references suggest a connection. An officer must review the evidence before confirming it."},
  {from:"DEMO-02",to:"DEMO-03",label:"Review required",review:true,detail:"Faculty information may relate to the compliance request. This is not a confirmed dependency."},
  {from:"DEMO-01",to:"DEMO-04",label:"Recorded link",review:false,detail:"Illustrative recorded follow-up relationship. Both complaints retain separate owners."},
  {from:"DEMO-02",to:"DEMO-05",label:"Suggested",review:true,detail:"The renewal check may need the same documents. No action or ownership changes automatically."},
];
export function DependencyMap() {
  const resource = useResource<InstitutionConnection[]>("/api/coordination");
  const cases = useResource<{items:CaseSummary[]}>("/api/cases?limit=200");
  const relationships = useResource<Pair[]>("/api/relationships");
  const [source,setSource] = useState("");
  const [mode,setMode] = useState("plan");
  const [zoom,setZoom] = useState(1);
  const [selected,setSelected] = useState<Node | Edge | null>(null);
  const effectiveSource = source || resource.data?.find(g=>g.institution_id==="SIH-INST-01")?.id || resource.data?.[0]?.id || "example";
  const group = resource.data?.find(g=>g.id===effectiveSource);
  const titles = new Map(cases.data?.items.map(c=>[c.id,c.subject]) ?? []);
  const nodes: Node[] = group ? [{id:group.id,title:group.institution,status:words(group.state),unit:"Shared coordination plan",detail:group.next_action,href:"#/coordination?institution="+encodeURIComponent(group.institution_id)},...group.cases.slice().sort((a,b)=>a.id.localeCompare(b.id)).map(c=>({id:c.id,title:titles.get(c.id) ?? c.id,status:words(c.lifecycle),unit:words(c.bureau),detail:`Owner: ${c.owner}. Due: ${c.due_at ? new Date(c.due_at).toLocaleDateString("en-IN") : "Not set"}. ${c.historical_participation ? "Historical participation" : "Recorded plan participation"}.`,href:"#/cases/"+encodeURIComponent(c.id)}))] : samples;
  const planEdges: Edge[] = group ? group.cases.map(c=>({from:group.id,to:c.id,label:c.historical_participation?"Historical":"Participation",review:false,detail:"Recorded coordination membership, not a case dependency or an ownership transfer."})) : exampleEdges;
  const pairEdges: Edge[] = group ? (relationships.data ?? []).filter(p=>group.cases.some(c=>c.id===p.left)&&group.cases.some(c=>c.id===p.right)).map(p=>{
    const decision=p.decisions.filter(d=>d.action==="CONFIRM"||d.action==="REJECT").at(-1);
    return {from:p.left,to:p.right,label:p.stale?"Needs review":decision?.action==="REJECT"?"Rejected":decision?words(decision.label ?? "RELATED"):"Suggested",review:p.stale||!decision,detail:decision?.reason ?? "Shared source references require coordinator evidence review. No automatic merging or ownership change."};
  }) : exampleEdges;
  const edges = mode==="relationships" ? pairEdges : planEdges;
  const visibleNodes = mode==="relationships" && group ? nodes.slice(1) : nodes;
  const positions = visibleNodes.map((_,i)=>group && mode==="plan" ? (i===0?{x:340,y:20}:{x:40+((i-1)%3)*300,y:230+Math.floor((i-1)/3)*220}) : {x:40+(i%3)*300,y:40+Math.floor(i/3)*220});
  const height=Math.max(460,...positions.map(p=>p.y+180));
  function changeSource(value:string) {setSource(value);setSelected(null);}
  return <>
    <PageHeading title="Visual Dependency Map">Explore case connections and shared institution work.</PageHeading>
    <section className="dependency-banner"><Icon name="coordination" size={30}/><div><small>CASE RELATIONSHIPS</small><h2>Visualise connections across complaints.</h2><p>Select a case or connection to inspect its details.</p></div></section>
    <section className="panel padded dependency-panel">
      <div className="inline spread"><h2>Case relationship graph</h2><div><label htmlFor="map-source">View</label><select id="map-source" value={effectiveSource} onChange={e=>changeSource(e.target.value)}><option value="example">Illustrative example</option>{resource.data?.map(g=><option key={g.id} value={g.id}>{g.institution}</option>)}</select></div></div>
      <div className="map-toolbar"><div className="inline"><button aria-pressed={mode==="plan"} onClick={()=>{setMode("plan");setSelected(null);}}>Shared plan</button><button aria-pressed={mode==="relationships"} onClick={()=>{setMode("relationships");setSelected(null);}}>Evidence relationships</button></div><div className="inline"><button aria-label="Zoom out" disabled={zoom<=.6} onClick={()=>setZoom(z=>Math.max(.6,z-.2))}>−</button><span>{Math.round(zoom*100)}%</span><button aria-label="Zoom in" disabled={zoom>=1.4} onClick={()=>setZoom(z=>Math.min(1.4,z+.2))}>+</button><button onClick={()=>setZoom(1)}>Reset view</button></div></div>
      <p className="small">Cases: {group ? group.cases.length : nodes.length} · Links: {edges.length} · <span className="map-legend">Dashed line: review required</span></p>
      {!group && <p className="map-notice">Illustrative records and relationships for demonstration. These are not your saved complaints.</p>}
      {group && <p className="map-notice">Your authorised coordination records. Inspect recorded plan participation or evidence relationships. Each case retains its own owner.</p>}
      {resource.error && <p role="alert">Live plans could not be loaded. <button onClick={resource.reload}>Retry</button></p>}
      {resource.loading && <p role="status">Loading saved coordination plans…</p>}
      {mode==="relationships" && !edges.length && <p className="map-notice">No evidence relationships are available in your review scope for this plan. Shared-plan connections remain available.</p>}
      <div className="dependency-scroll"><div style={{width:940*zoom,height:height*zoom,margin:"auto"}}><div className="dependency-canvas" style={{height,transform:`scale(${zoom})`,transformOrigin:"top left"}}>
        <svg width="940" height={height} aria-label="Relationship connections">
          {edges.map((edge,i)=>{
            const a=positions[visibleNodes.findIndex(n=>n.id===edge.from)],b=positions[visibleNodes.findIndex(n=>n.id===edge.to)];
            if(!a||!b)return null;
            const sameRow=a.y===b.y;
            const x1=a.x+120,y1=a.y+140,x2=b.x+120,y2=b.y;
            const hub=!!group && mode==="plan";
            const lane=12+(i%3)*8;
            const d=hub?(b.y<460?`M ${x1} ${y1} V 195 H ${x2} V ${y2}`:`M ${x1} ${y1} V 180 H ${lane} V ${y2-24} H ${x2} V ${y2}`):sameRow?`M ${a.x+120} ${a.y} V ${a.y-20} H ${x2} V ${b.y}`:`M ${x1} ${y1} V ${y1+35} H ${x2} V ${y2}`;
            return <g key={edge.from+edge.to} role="button" tabIndex={0} aria-label={`${edge.from} to ${edge.to}: ${edge.label}`} onClick={()=>setSelected(edge)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(edge);}}} className={edge.review?'map-edge review':'map-edge'}><path d={d} className="edge-hit"/><path d={d}/><text x={hub?x2:sameRow?(x1+x2)/2:(x1+x2)/2} y={hub?y2-8:sameRow?a.y-24:y1+29} textAnchor="middle">{edge.label}</text></g>;
          })}
        </svg>
        {visibleNodes.map((node,i)=><button key={node.id} className="map-node" style={{left:positions[i].x,top:positions[i].y}} onClick={()=>setSelected(node)} aria-pressed={!!selected && 'id' in selected && selected.id===node.id}><span className="map-node-id">{group && node.id===group.id ? "SHARED PLAN" : node.id}</span><strong>{node.title}</strong><span>{node.status}</span><small>{node.unit}</small><span className="map-node-hint">Select to inspect →</span></button>)}
      </div></div></div>
      <div className="map-inspector" aria-live="polite">{selected?<><h3>{'title' in selected ? selected.title : `${selected.from} → ${selected.to}`}</h3><p>{selected.detail}</p>{'href' in selected && selected.href && <a className="button" href={selected.href}>Open record →</a>}</>:<p>Select a node or a connecting line to see details here.</p>}</div>
    </section>
  </>;
}
