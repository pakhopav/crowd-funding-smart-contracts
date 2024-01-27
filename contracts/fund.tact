import "@stdlib/deploy";

contract Fund with Deployable {
    id: Int as uint32;
    name: String;
    description: String;
    goal: Int as uint32;
    previosAddedFund: Address?;
    init(id: Int, name: String, description: String, goal: Int, ccc: Address?){
        self.id = id;
        self.name = name;
        self.description = description;
        self.goal = goal;
        self.previosAddedFund = ccc;
    }

    receive(){}

    get fun balance(): Int {
        return myBalance();
    }
}