const COURSES = [
  {id:1,title:"DSA - Complete Guide (Arrays & Strings)",cat:"dsa",tags:["beginner","arrays","python"],level:"beginner",thumbnail:"Arrays & Strings",desc:"array / string problems, two pointers, sliding window",video:"https://youtu.be/8wmn7k1TTcI"},
  {id:2,title:"Graph Algorithms - BFS & DFS",cat:"dsa",tags:["graphs","advanced","java"],level:"intermediate",thumbnail:"Graphs",desc:"BFS, DFS, shortest paths essentials",video:""},
  {id:3,title:"System Design Basics",cat:"nontechnical",tags:["system-design","beginner"],level:"beginner",thumbnail:"System Design",desc:"Intro to load balancers",video:""},
  {id:4,title:"Live Class 11 Maths",cat:"classes",tags:["beginner"],level:"beginner",thumbnail:"Class 11 Maths",desc:"Complete recorded lecture",video:""},
  {id:5,title:"Web Dev - Modern JS & React",cat:"technical",tags:["webdev","advanced","javascript"],level:"intermediate",thumbnail:"Web Dev",desc:"React basics",video:""},
  {id:6,title:"Interview Problems - Python",cat:"interview",tags:["advanced","python"],level:"advanced",thumbnail:"Interview Prep",desc:"Top interview problems",video:""},
  {id:7,title:"Communication Skills",cat:"nontechnical",tags:["beginner"],level:"beginner",thumbnail:"Comm Skills",desc:"Soft skills",video:""},
  {id:8,title:"Class 12 Science",cat:"classes",tags:["science","beginner"],level:"beginner",thumbnail:"Class 12 Science",desc:"Physics intro",video:""}
];

let state = {
  q:'',
  cats:new Set(["dsa","classes","technical","nontechnical","interview","webdev"]),
  tags:new Set(),
  level:'all',
  sort:'popular'
};

const grid = document.getElementById('grid');
const noresult = document.getElementById('noresult');

function render(){
  const q = state.q.trim().toLowerCase();
  let items = COURSES.filter(c=>state.cats.has(c.cat));

  if(state.tags.size){
    items = items.filter(c => [...state.tags].every(t=>c.tags.includes(t)));
  }

  if(state.level !== 'all'){
    items = items.filter(c=>c.level===state.level);
  }

  if(q){
    items = items.filter(c => (c.title+c.desc+c.tags.join(' ')).toLowerCase().includes(q));
  }

  if(state.sort==="alpha") items.sort((a,b)=>a.title.localeCompare(b.title));
  else if(state.sort==="new") items = items.slice().reverse();

  grid.innerHTML = '';
  if(items.length===0){
    noresult.style.display="block";
  } else {
    noresult.style.display="none";
    items.forEach(c=>{
      const card = document.createElement('article');
      card.className='card';
      card.innerHTML = `
        <div class="thumb">${c.thumbnail}</div>
        <h5>${c.title}</h5>
        <div class="meta">${c.desc}</div>
        <div class="tags">${c.tags.map(t=>`<span class="tag-mini">${t}</span>`).join('')}</div>
        <div class="cta">
          <button class="btn-ghost" onclick="previewCourse(${c.id})">Preview</button>
          <button class="btn-primary" onclick="enroll(${c.id})">Enroll</button>
        </div>`;
      grid.appendChild(card);
    });
  }
}

document.querySelectorAll('#category-list input').forEach(cb=>{
  cb.addEventListener('change',(e)=>{
    if(e.target.checked) state.cats.add(e.target.value);
    else state.cats.delete(e.target.value);
    render();
  });
});

document.querySelectorAll('#tag-cloud .tag').forEach(t=>{
  t.addEventListener('click',(ev)=>{
    const tag = ev.target.dataset.tag;
    if(state.tags.has(tag)){
      state.tags.delete(tag);
      ev.target.classList.remove('active');
    } else {
      state.tags.add(tag);
      ev.target.classList.add('active');
    }
    render();
  });
});

function setLevel(l){ state.level=l; render(); }
window.setLevel = setLevel;

document.getElementById('search-btn').addEventListener('click',()=>{
  state.q = document.getElementById('search-input').value;
  render();
});
document.getElementById('search-input').addEventListener('keyup',(e)=>{
  state.q = e.target.value;
  if(e.key==="Enter") render();
});

document.getElementById('sort').addEventListener('change',(e)=>{
  state.sort = e.target.value;
  render();
});

function clearFilters(){
  state.cats = new Set(["dsa","classes","technical","nontechnical","interview","webdev"]);
  document.querySelectorAll('#category-list input').forEach(cb=>cb.checked=true);

  state.tags.clear();
  document.querySelectorAll('#tag-cloud .tag').forEach(t=>t.classList.remove('active'));

  state.level='all';
  state.q='';
  document.getElementById('search-input').value='';
  render();
}
window.clearFilters = clearFilters;

function previewCourse(id){
  const c = COURSES.find(x=>x.id===id);
  if(!c) return;
  window.open(c.video,"_blank");
}
function enroll(id){
  const c = COURSES.find(x=>x.id===id);
  if(c) alert("Enrolled: " + c.title);
}

document.getElementById('view-all').addEventListener('click',()=>{
  const anyUnchecked = [...document.querySelectorAll('#category-list input')].some(cb=>!cb.checked);
  document.querySelectorAll('#category-list input').forEach(cb=>cb.checked = anyUnchecked);
  state.cats = new Set([...document.querySelectorAll('#category-list input:checked')].map(i=>i.value));
  render();
});

render();
