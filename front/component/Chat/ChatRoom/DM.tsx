const DM = () => {
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
            font-family: "Doppio One";
            font-style: normal;
            font-weight: 400;
            font-size: 30px;
            line-height: 20px;
            /* identical to box height, or 67% */

            text-transform: uppercase;

            color: #000000;
          }
          .DM {
            height: 286px;
          }
        `}
      </style>
    </div>
  );
};

export default DM;
