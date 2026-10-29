import { useState } from "react";
const samples = [
  {file:"hindi-letter.png",language:"Hindi",title:"Fee refund request",text:"A demo student requests an update on a fee refund after cancelling admission."},
  {file:"marathi-letter.png",language:"Marathi",title:"Certificate request",text:"A demo student asks the grievance officer to check a pending certificate application."},
];
export function SampleAttachments() {
  const [preview,setPreview] = useState<string | null>(null);
  return <section className="sample-attachments" aria-label="Handwritten sample attachments"><h3>Handwritten sample attachments</h3>
    <p className="small muted">Generated demo pages, not submitted evidence. Download a sample to try the attachment upload.</p>
    <div className="sample-file-grid">{samples.map(sample=><article key={sample.file}>
      <button type="button" className="sample-thumbnail" onClick={()=>setPreview(preview===sample.file?null:sample.file)} aria-expanded={preview===sample.file} aria-label={`Preview ${sample.language} handwritten sample`}><img src={'/demo-attachments/'+sample.file} alt={`Synthetic handwritten ${sample.language} ${sample.title.toLowerCase()}`} loading="lazy"/></button>
      <strong>{sample.language} · {sample.title}</strong><p className="small">{sample.text}</p><a href={'/demo-attachments/'+sample.file} download>Download sample PNG</a>
      {preview===sample.file && <div className="sample-preview"><img src={'/demo-attachments/'+sample.file} alt={`${sample.language} demo letter, enlarged`}/><button type="button" onClick={()=>setPreview(null)}>Close preview</button></div>}
    </article>)}</div>
  </section>;
}
