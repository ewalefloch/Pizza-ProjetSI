import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const RenderPieChart = ({ title, data }) => (
  <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center overflow-hidden">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={100} // Augmentation pour un meilleur rendu
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" align="center" verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default RenderPieChart;
