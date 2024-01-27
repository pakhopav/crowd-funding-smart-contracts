import { toNano } from '@ton/core';
import { FundManager } from '../wrappers/FundManager';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const fundManager = provider.open(await FundManager.fromInit());

    await fundManager.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(fundManager.address);

    // run methods on `fundManager`
}
