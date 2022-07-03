
export interface ContractConsensusInfo {
  total: number;

  agree: number;
  disagree: number;
  neutral: number;
  absent: number;

  agreement: number;
}

export interface ContractTerms<ContractMetaData> {
  name: string;
  metaData: ContractMetaData;
}

export interface DistributeContract<ContractData> {
  (terms: ContractTerms<ContractData>): number;
}

export function createContract<ContractData>
(terms: ContractTerms<ContractData>, distribute: DistributeContract<ContractData>):
Promise<ContractConsensusInfo> {
  return new Promise(async (_resolve, _reject) => {
    let consensus: ContractConsensusInfo = {
      total: 0,

      agree: 0,
      disagree: 0,
      neutral: 0,
      absent: 0,
      agreement: 0
    };

    consensus.agree = distribute(terms);

    consensus.agreement = consensus.agree / consensus.total;

    _resolve(consensus);
  });
}

export function test() {
  //define the shape of a player
  interface Player {
    name: string;
    publicKey: string;
    status: "alive" | "dead";
    health: number;
  }

  //function that checks if a player should die (this could be modified by a 'hacker' client)
  function checkPlayerShouldBeDead(player: Player) {
    //no need to check if a player should be dead if they're already dead
    return player.status != "dead" && player.health <= 0.0;
  }

  //declare a player that is online and playing with us
  let playerThatDies: Player = {
    name: "Anon",
    publicKey: Math.random().toString(16),
    status: "alive",
    health: 0
  };

  interface PlayerShouldBeDead {
    playerPublicKey: string;
  }

  //check if our logic says he should die
  if (checkPlayerShouldBeDead(playerThatDies)) {

    //prepare logic
    let terms: ContractTerms<PlayerShouldBeDead> = {
      name: "playerShouldBeDead",
      metaData: {
        playerPublicKey: playerThatDies.publicKey
      }
    };

    let remoteConnections = 10;

    //let anarchy decide
    createContract(terms, (terms)=>{
      //TODO - send to peers (probably over internet)
      let result = 0;
      //simulate getting mixed results from peers
      for (let i=0; i<remoteConnections; i++) {
        if (Math.random() > 0.5) result ++;
      }
      return result;
    }).then((consensus) => {

      //this could be hacked, but this client will be in disagreement with the peers
      //code should be written that if a peer disagrees with another that they won't co-operate (connect/share data)
      //a natural consensus will always be reached
      if (consensus.agreement > 0.5) {

        //update our state to match what consensus says
        playerThatDies.status = "dead";
      }
    });
  }


}
