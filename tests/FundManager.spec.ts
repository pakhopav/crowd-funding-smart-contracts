import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Address, ContractProvider, toNano } from '@ton/core';
import { FundManager } from '../wrappers/FundManager';
import '@ton/test-utils';
import { Fund } from '../build/FundManager/tact_Fund';

describe('FundManager', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let fundManager: SandboxContract<FundManager>;
    let fund: SandboxContract<Fund>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        blockchain.loadFrom

        fundManager = blockchain.openContract(await FundManager.fromInit());

    
        deployer = await blockchain.treasury('deployer');

        const deployResult = await fundManager.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: fundManager.address,
            deploy: true,
            success: true,
        });
    });

    it('should work', async () => {
        console.log("========= adres-------");
        console.log(fundManager.address);
        let lastCreatedAddress = await fundManager.getLastCreatedFundAddress()
        if(lastCreatedAddress){
            console.log("=========last adres-------");
            console.log(lastCreatedAddress);
        }else {
            // Обработка случая, когда адрес не найден (null)
            console.log("Адрес не найден.");
        }
        let totalCreated = await fundManager.getCreatedCount()
        console.log("=========cotal created-------");
        console.log(totalCreated);


        await fundManager.send(deployer.getSender(), { value : toNano("0.2")}, 
        {
            $$type: 'CreateFund',
            name: "first fund",
            description: "first fund desc",
            goal: 1000n

        })

         lastCreatedAddress = await fundManager.getLastCreatedFundAddress()
        if(lastCreatedAddress){
            console.log("=========new last adres-------");
            console.log(lastCreatedAddress);
        }else {
            // Обработка случая, когда адрес не найден (null)
            console.log("Адрес не найден.");
        }
         totalCreated = await fundManager.getCreatedCount()
        console.log("=========new cotal created-------");
        console.log(totalCreated);


        
        
        let provider: ContractProvider = await blockchain.provider(lastCreatedAddress!!);
        console.log(await provider.getState());
        console.log((await provider.get("name", [])).stack.peek());
        
    });
});
