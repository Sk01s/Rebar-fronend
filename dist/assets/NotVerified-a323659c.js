import{u as m,r as c,a as l,j as a}from"./index-9fcefab8.js";import{u as h}from"./SetOutFucntions-b315eaf2.js";import"./firebase-config-409fc865.js";const v=()=>{const r=m(),{sendEmailVerification:d,checkForVerifiction:f,currentUser:e}=h(),[n,s]=c.useState(JSON.parse(localStorage.getItem("waintingTime"))||0),o=()=>{const t=setInterval(()=>{s(i=>i<=0?(clearInterval(t),i):(localStorage.setItem("waintingTime",JSON.stringify(i-1)),i-1))},1e3)};return c.useEffect(()=>{const t=setInterval(()=>{e||(clearInterval(t),r("/")),e!=null&&e.emailVerified&&(clearInterval(t),r("/"))},1e3);o()},[]),f(),l("main",{className:"notverified-container",children:[a("h2",{className:"title",children:"Your email is not verified"}),l("div",{children:["left time to resend ",n]}),a("button",{onClick:()=>{n===0&&(s(60),o(),d(e))},disabled:n!==0,children:"resend messege"}),a("p",{children:"if could not find it check in the Span category"})]})};export{v as default};