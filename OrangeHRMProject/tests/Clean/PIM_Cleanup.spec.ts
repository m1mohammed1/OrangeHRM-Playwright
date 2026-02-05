import { test } from '@fixtures/test-setup';
test.describe('PIM Cleanup', () => {
    
    
    test('Cleanup: 77777', async ({ pimPage }) => {
        await pimPage.deleteIfExists("77777");
    });
    
});