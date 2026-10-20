import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cases } from "@/data/cases";
import CaseDocument from "@/components/CaseDocument";
import NotFound from "./NotFound";
export default function CaseRoute(){
  const {id}=useParams();const item=cases.find(c=>c.id===id);const [content,setContent]=useState('');
  useEffect(()=>{let current=true;setContent('');item?.loadContent().then(value=>{if(current)setContent(value)});return()=>{current=false}},[item]);
  if(!item)return <NotFound/>;
  return content?<CaseDocument item={item} content={content}/>:<p className="p-8" role="status">Загружаю кейс…</p>;
}
