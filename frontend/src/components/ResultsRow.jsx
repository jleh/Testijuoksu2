const ResultsRow = ({ row }) => (
  <tr>
    <td className="pr-5">{row.name}</td>
    <td className="font-bold pr-5">{row.total_time}</td>
    {row.splits.map((split) => (
      <td key={split.round}>{split.time}</td>
    ))}
  </tr>
);

export default ResultsRow;
