import "@stdlib/deploy";
message CreateFund {
    name: String;
    description: String;
    goal: Int;
}

contract FundManager with Deployable {
    lastCreatedFund: Address?;
    createdCount: Int as uint32;
    init(){
        self.createdCount = 0;
        self.lastCreatedFund = null;
    }

    get fun lastCreatedFundAddress(): Address? {
        return self.lastCreatedFund;
    }

    get fun createdCount(): Int {
        return self.createdCount;
    }

    receive(msg: CreateFund){
        self.createdCount = (self.createdCount + 1);
        let lastAddress: Address = myAddress();
        if (self.lastCreatedFund != null) {
            lastAddress = self.lastCreatedFund!!;
        }
        let init: StateInit = initOf Fund(self.createdCount, msg.name, msg.description, msg.goal, lastAddress);
        self.lastCreatedFund = contractAddress(init);
        send(SendParameters{
                to: self.lastCreatedFund!!,
                value: 0,
                mode: (SendRemainingValue + SendIgnoreErrors),
                bounce: true,
                code: init.code,
                data: init.data,
                body: Deploy{queryId: 0}.toCell()
            }
        );
    }
}

contract Fund with Deployable {
    id: Int as uint32;
    name: String;
    description: String;
    goal: Int as uint32;
    previosAddedFund: Address;
    init(id: Int, name: String, description: String, goal: Int, ccc: Address){
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

    get fun id(): Int {
        return self.id;
    }

    get fun name(): String {
        return self.name;
    }

    get fun desctription(): String {
        return self.description;
    }

    get fun goal(): Int {
        return self.goal;
    }
}