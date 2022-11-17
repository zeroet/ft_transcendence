export default function DM() {
  return (
    <div className="DM">
      <h1>DM</h1>
      <hr />
      <ul>
        <li>dm 1</li>
        <li>dm 2</li>
        <li>dm 3</li>
      </ul>
      <style jsx>
        {`
          h1 {
            font-family: "Fragment Mono", monospace;
            font-weight: bold;
            font-size: 25px;
            line-height: 20px;
            margin-left: 10px;
            /* identical to box height, or 67% */
            text-transform: uppercase;
          }
          .DM {
            height: 50%;
          }
        `}
      </style>
    </div>
  );
}
