import { createContext, useContext } from 'react';
// EXPORTS: IPortfolioContext{cursor,setCursor,info,setInfo,introDone}, PortfolioContext, usePortfolio
export interface IPortfolioContext { editingPoint:number; setEditingPoint:(v:number)=>void; deliveryPoint:number; setDeliveryPoint:(v:number)=>void; executionPoint:number; setExecutionPoint:(v:number)=>void; corePoint:number; setCorePoint:(v:number)=>void; cursor: number; setCursor: (update: number | ((n:number)=>number)) => void; info:boolean; setInfo:(v:boolean | ((v:boolean)=>boolean))=>void; introDone:boolean }
export const PortfolioContext = createContext<IPortfolioContext | null>(null);
export function usePortfolio(){ const context = useContext(PortfolioContext); if(!context) throw new Error('Missing portfolio provider'); return context; }
