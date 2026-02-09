'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PlusCircle, MinusCircle, Wallet, CreditCard, Banknote, Coins, Calendar, TrendingUp, TrendingDown, ClipboardList, LogOut, Church } from 'lucide-react'

interface Ingreso {
  id: string
  fecha: string
  dia: string
  oBilletes: number
  oMonedas: number
  oTarjeta: number
  dBilletes: number
  dMonedas: number
  dTarjeta: number
  semana: number
}

interface Gasto {
  id: string
  fecha: string
  desc: string
  monto: number
  metodo: string
  semana: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [view, setView] = useState('registro')

  const [inForm, setInForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    dia: 'Domingo',
    oBilletes: 0, oMonedas: 0, oTarjeta: 0,
    dBilletes: 0, dMonedas: 0, dTarjeta: 0
  })

  const [exForm, setExForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    desc: '',
    monto: 0,
    metodo: 'Efectivo'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Church className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const getSemana = (fechaStr: string) => {
    const dia = new Date(fechaStr).getDate()
    return Math.floor((dia - 1) / 7) + 1
  }

  const agregarIngreso = () => {
    const nuevo = { ...inForm, id: Date.now().toString(), semana: getSemana(inForm.fecha) }
    setIngresos([...ingresos, nuevo])
    setInForm({ ...inForm, oBilletes: 0, oMonedas: 0, oTarjeta: 0, dBilletes: 0, dMonedas: 0, dTarjeta: 0 })
  }

  const agregarGasto = () => {
    if (!exForm.desc || exForm.monto <= 0) return
    const nuevo = { ...exForm, id: Date.now().toString(), semana: getSemana(exForm.fecha) }
    setGastos([...gastos, nuevo])
    setExForm({ ...exForm, desc: '', monto: 0 })
  }

  const totalIngresos = ingresos.reduce((acc, curr) => 
    acc + curr.oBilletes + curr.oMonedas + curr.oTarjeta + curr.dBilletes + curr.dMonedas + curr.dTarjeta, 0)
  
  const totalGastos = gastos.reduce((acc, curr) => acc + curr.monto, 0)
  
  const totalEfectivoIngresado = ingresos.reduce((acc, curr) => 
    acc + curr.oBilletes + curr.oMonedas + curr.dBilletes + curr.dMonedas, 0)
  
  const totalGastosEfectivo = gastos.filter(g => g.metodo === 'Efectivo').reduce((acc, curr) => acc + curr.monto, 0)
  
  const efectivoEnCaja = totalEfectivoIngresado - totalGastosEfectivo

  const formatMoney = (val: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Church className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">En Su Presencia</h1>
                <p className="text-sm text-gray-500">Contabilidad Operativa de Cultos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bienvenido, {session.user?.username}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-xl shadow-sm p-1 border border-slate-200">
            <button 
              onClick={() => setView('registro')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'registro' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Registro Diario
            </button>
            <button 
              onClick={() => setView('reporte')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'reporte' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Informe Mensual
            </button>
          </div>
        </div>

        {/* Dashboard de Totales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-2">
              <TrendingUp className="text-blue-500 w-5 h-5" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ingresos</span>
            </div>
            <p className="text-2xl font-bold">{formatMoney(totalIngresos)}</p>
            <p className="text-xs text-slate-400 mt-1">Total del mes</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
            <div className="flex justify-between items-start mb-2">
              <TrendingDown className="text-red-500 w-5 h-5" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gastos</span>
            </div>
            <p className="text-2xl font-bold">{formatMoney(totalGastos)}</p>
            <p className="text-xs text-slate-400 mt-1">Total egresos</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-indigo-500">
            <div className="flex justify-between items-start mb-2">
              <Wallet className="text-indigo-500 w-5 h-5" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Balance Neto</span>
            </div>
            <p className={`text-2xl font-bold ${totalIngresos - totalGastos >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatMoney(totalIngresos - totalGastos)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Diferencia total</p>
          </div>
          <div className="bg-indigo-900 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex justify-between items-start mb-2">
              <Banknote className="text-indigo-300 w-5 h-5" />
              <span className="text-[10px] font-bold text-indigo-300 uppercase">Caja Física</span>
            </div>
            <p className="text-2xl font-bold">{formatMoney(efectivoEnCaja)}</p>
            <p className="text-xs text-indigo-300 mt-1">Billetes + Monedas reales</p>
          </div>
        </div>

        {view === 'registro' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Panel Izquierdo: Formularios */}
            <div className="lg:col-span-4 space-y-6">
              {/* Formulario Ingresos */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-900">
                  <PlusCircle className="w-5 h-5" /> Registrar Culto
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Fecha</label>
                      <input 
                        type="date" 
                        value={inForm.fecha} 
                        onChange={e => setInForm({...inForm, fecha: e.target.value})} 
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Día</label>
                      <select 
                        value={inForm.dia} 
                        onChange={e => setInForm({...inForm, dia: e.target.value})} 
                        className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      >
                        <option>Jueves</option><option>Sábado</option><option>Domingo</option><option>Especial</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Ofrendas</p>
                    <div className="grid grid-cols-3 gap-2">
                      <input 
                        type="number" 
                        placeholder="Bill." 
                        className="p-2 rounded-lg text-sm" 
                        onChange={e => setInForm({...inForm, oBilletes: parseFloat(e.target.value) || 0})} 
                      />
                      <input 
                        type="number" 
                        placeholder="Mon." 
                        className="p-2 rounded-lg text-sm" 
                        onChange={e => setInForm({...inForm, oMonedas: parseFloat(e.target.value) || 0})} 
                      />
                      <input 
                        type="number" 
                        placeholder="Tarj." 
                        className="p-2 rounded-lg text-sm" 
                        onChange={e => setInForm({...inForm, oTarjeta: parseFloat(e.target.value) || 0})} 
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-[10px] font-bold text-purple-400 uppercase mb-2">Diezmos</p>
                    <div className="grid grid-cols-3 gap-2">
                      <input 
                        type="number" 
                        placeholder="Bill." 
                        className="p-2 rounded-lg text-sm" 
                        onChange={e => setInForm({...inForm, dBilletes: parseFloat(e.target.value) || 0})} 
                      />
                      <input 
                        type="number" 
                        placeholder="Mon." 
                        className="p-2 rounded-lg text-sm" 
                        onChange={e => setInForm({...inForm, dMonedas: parseFloat(e.target.value) || 0})} 
                      />
                      <input 
                        type="number" 
                        placeholder="Tarj." 
                        className="p-2 rounded-lg text-sm" 
                        onChange={e => setInForm({...inForm, dTarjeta: parseFloat(e.target.value) || 0})} 
                      />
                    </div>
                  </div>

                  <button 
                    onClick={agregarIngreso} 
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                  >
                    Guardar Recaudación
                  </button>
                </div>
              </div>

              {/* Formulario Gastos */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-700">
                  <MinusCircle className="w-5 h-5" /> Registrar Gasto
                </h3>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Descripción del gasto..." 
                    value={exForm.desc} 
                    onChange={e => setExForm({...exForm, desc: e.target.value})} 
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" 
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      placeholder="Monto €" 
                      value={exForm.monto || ''} 
                      onChange={e => setExForm({...exForm, monto: parseFloat(e.target.value) || 0})} 
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" 
                    />
                    <select 
                      value={exForm.metodo} 
                      onChange={e => setExForm({...exForm, metodo: e.target.value})} 
                      className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    >
                      <option>Efectivo</option><option>Tarjeta</option>
                    </select>
                  </div>
                  <button 
                    onClick={agregarGasto} 
                    className="w-full py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
                  >
                    Registrar Salida
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Derecho: Listado Temporal */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" /> Movimientos Recientes
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b">
                      <tr>
                        <th className="px-6 py-4">Fecha/Día</th>
                        <th className="px-6 py-4">Concepto</th>
                        <th className="px-6 py-4 text-center">Met. Pago</th>
                        <th className="px-6 py-4 text-right">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ingresos.map(i => (
                        <tr key={i.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium">{i.fecha} <span className="block text-[10px] text-slate-400 uppercase">{i.dia}</span></td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">RECAUDACIÓN CULTO</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2 text-slate-400">
                              {i.oBilletes + i.dBilletes > 0 && <Banknote className="w-4 h-4" />}
                              {i.oMonedas + i.dMonedas > 0 && <Coins className="w-4 h-4" />}
                              {i.oTarjeta + i.dTarjeta > 0 && <CreditCard className="w-4 h-4" />}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-emerald-600">
                            {formatMoney(i.oBilletes + i.oMonedas + i.oTarjeta + i.dBilletes + i.dMonedas + i.dTarjeta)}
                          </td>
                        </tr>
                      ))}
                      {gastos.map(g => (
                        <tr key={g.id} className="text-sm hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium">{g.fecha}</td>
                          <td className="px-6 py-4">
                            <span className="block text-slate-700">{g.desc}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.metodo === 'Efectivo' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                              {g.metodo.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-red-500">
                            -{formatMoney(g.monto)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Informe Semanal */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold mb-6 text-indigo-900 border-l-4 border-l-indigo-500 pl-4">Desglose Semanal Administrativo</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(s => {
                  const ingS = ingresos.filter(i => i.semana === s).reduce((acc, curr) => acc + curr.oBilletes + curr.oMonedas + curr.oTarjeta + curr.dBilletes + curr.dMonedas + curr.dTarjeta, 0)
                  const gasS = gastos.filter(g => g.semana === s).reduce((acc, curr) => acc + curr.monto, 0)
                  return (
                    <div key={s} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-3">Semana {s}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Ingresos:</span>
                          <span className="font-bold text-emerald-600">+{formatMoney(ingS)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Gastos:</span>
                          <span className="font-bold text-red-500">-{formatMoney(gasS)}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-700">
                          <span>Saldo:</span>
                          <span>{formatMoney(ingS - gasS)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Desglose de Canales de Dinero */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-indigo-500" /> Distribución de Efectivo
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium">Billetes (Ofrenda + Diezmo)</span>
                    <span className="font-bold">{formatMoney(ingresos.reduce((a,c) => a + c.oBilletes + c.dBilletes, 0))}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium">Monedas (Ofrenda + Diezmo)</span>
                    <span className="font-bold">{formatMoney(ingresos.reduce((a,c) => a + c.oMonedas + c.dMonedas, 0))}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 text-red-700 rounded-xl">
                    <span className="text-sm font-medium italic">Menos Gastos en Efectivo</span>
                    <span className="font-bold">-{formatMoney(totalGastosEfectivo)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-500" /> Movimientos en Tarjeta/Banco
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 text-blue-800 rounded-xl">
                    <span className="text-sm font-medium">Ingresos por Tarjeta</span>
                    <span className="font-bold">{formatMoney(ingresos.reduce((a,c) => a + c.oTarjeta + c.dTarjeta, 0))}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium">Gastos con Tarjeta</span>
                    <span className="font-bold text-red-500">-{formatMoney(gastos.filter(g => g.metodo === 'Tarjeta').reduce((a,c) => a + c.monto, 0))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
