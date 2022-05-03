let sample = {
  "Stauts": "created",
  "GameID": "c16458",
  "HostUserId": "0.2799179715663529",
  "StakedAmount": 300,
  "GameBoard": [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ],
  "CurrentPlayer": "",
  "OpponentUserId": ""
}


export default function Game({ wsocket, data }) {
  console.log(data);
  async function Play(position) {
    console.log(position);
    //wsocket code here
  }

  return (
    <main className="container-fluid mx-auto">
      {data &&
        <>
          <div className="row mx-5">

            <div className="col-3">
              <h2>Game: </h2><span> {data.GameID}</span>
              <h3>Host: </h3><span>{data.HostUserId}</span>
              <h3>Opponent: </h3><span>{data.OpponentUserId}</span>
              <h3>Stake: </h3><span> {data.StakedAmount}</span>
            </div>

            <div className="col-md-7">
              {data.GameBoard &&
                <div className="grid-container">

                  {data.GameBoard.map((value, index) => (
                    <button key={index} onClick={(e) => Play(index)} className="grid-item" value={index}>{value}</button>
                  ))}
                </div>}
            </div>

          </div>
        </>}
    </main>
  )
}
