import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";
import CaseDocument from "./components/CaseDocument";
import { cases } from "./data/cases";
export const author={"@type":"Person","@id":"https://xicrie.ru/#author",name:"Алёна Степанова",url:"https://xicrie.ru/",jobTitle:"AI-специалист: автоматизация и маркетинг",description:"Создаю AI-инструменты, ботов и автоматизации. 7+ лет в маркетинге, контенте и цифровых проектах.",sameAs:["https://t.me/xicrie"],knowsAbout:["AI-разработка","AI-автоматизация","Разработка AI-ботов","AI-ассистенты","n8n","Автоматизация бизнес-процессов","B2B-маркетинг","CRM-коммуникации"]};
export function renderHome(){return renderToString(<StaticRouter location="/"><MotionConfig reducedMotion="always"><Index/></MotionConfig></StaticRouter>)}
export async function renderCases(){const pages=[];for(const item of cases){const content=await item.loadContent();pages.push({id:item.id,title:item.title,description:item.description,html:renderToStaticMarkup(<StaticRouter location={`/cases/${item.id}/`}><CaseDocument item={item} content={content}/></StaticRouter>)})}return pages}
