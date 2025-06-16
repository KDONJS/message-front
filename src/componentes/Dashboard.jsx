import React from 'react';
import Card from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './css/dashboard.css';
import AnimatedNumber from './AnimatedNumber';

const Dashboard = () => {
  const tickets = 12042;
  const incidencias = 12042;
  const usuarios = 12042;
  const mensajes = 12042;
  const average = 12042;
  const monthlyGoal = 19000;
  const monthlyGoalMax = 20000;

  const pieData = [
    { name: 'Ganados', value: 70 },
    { name: 'En Proceso', value: 80 },
    { name: 'Terceros', value: 90 },
  ];

  const COLORS = ['#ffdd00', '#c9a227', '#a47e1b'];

  const progress = Math.min((monthlyGoal / monthlyGoalMax) * 100, 100);

  const getBarColor = (progress) => {
    if (progress <= 15) return '#a63c06';
    if (progress >= 95) return '#33a29a';
    return '#bbb';
  };

  const tasks = [
    { id: 1, title: 'Llamar a cliente importante', done: false },
    { id: 2, title: 'Enviar reporte semanal', done: true },
    { id: 3, title: 'Revisar incidencias pendientes', done: false },
    { id: 4, title: 'Actualizar CRM', done: false },
    { id: 5, title: 'Responder mensajes nuevos', done: true },
  ];

  return (
    <div
      style={{
        padding: 32,
        background: '#dddddd',
        minHeight: '100vh',
        height: '100vh',
        overflowY: 'auto',
        boxSizing: 'border-box',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
      className="dashboard-scroll dashboard-animate"
    >
      <h1 style={{ fontWeight: 700, color: '#001233', marginBottom: 32 }}>Bienvenido @User</h1>
      <div className="dashboard-top">
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>Sales Pipeline</div>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>Monthly Goal</div>
          <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 16 }}>
            <AnimatedNumber value={monthlyGoal} />
          </div>
          <div style={{ width: '100%', height: 18, background: '#e0e0e0', borderRadius: 8 }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: getBarColor(progress),
                borderRadius: 8,
                transition: 'width 0.4s, background 0.4s'
              }}
            />
          </div>
        </Card>
      </div>
      <div className="dashboard-cards">
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Tickets Soporte</div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>
            <AnimatedNumber value={tickets} />
          </div>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Incidencias</div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>
            <AnimatedNumber value={incidencias} />
          </div>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Usuarios Activos</div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>
            <AnimatedNumber value={usuarios} />
          </div>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Mensajes entrantes</div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>
            <AnimatedNumber value={mensajes} />
          </div>
        </Card>
        <Card style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Average Value of Won Deals</div>
          <div style={{ fontWeight: 700, fontSize: 22 }}>
            <AnimatedNumber value={average} />
          </div>
        </Card>
      </div>
      <Card style={{ minHeight: 140 }}>
        <div style={{ fontWeight: 600, color: '#888', marginBottom: 8 }}>Tareas</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tasks.map(task => (
            <li
              key={task.id}
              style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                color: task.done ? '#aaa' : '#333',
                textDecoration: task.done ? 'line-through' : 'none',
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <input type="checkbox" checked={task.done} readOnly style={{ accentColor: '#4caf50' }} />
              {task.title}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;