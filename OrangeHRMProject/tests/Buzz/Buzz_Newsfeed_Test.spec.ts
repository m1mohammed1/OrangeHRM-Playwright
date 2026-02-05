import { test } from '@fixtures/test-setup';
import { TestConfig } from '@utils/TestConfig';

test.describe('Buzz_Newsfeed_Test', () => {

    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await test.step('Login and Navigate to Buzz', async () => {
            await loginPage.navigateTo(TestConfig.BASE_URL);
            await loginPage.login(TestConfig.USERNAME, TestConfig.PASSWORD);
            await dashboardPage.navigateToModule("Buzz");
        });
    });

    test('TC01 - Positive: Verify Post Lifecycle (Create, View, Delete) @regression', async ({ buzzPage }) => {
        const postText = `Auto Post ${Date.now()}`;
        
        await test.step('Create Post', async () => {
            await buzzPage.createPost(postText);
            await buzzPage.verifySuccessToast();
            await buzzPage.verifyPost(postText);

        });
        await test.step('Delete Post', async () => {
            await buzzPage.clickPostOptions(postText);
            await buzzPage.clickDeleteOption();
            await buzzPage.confirmDeletion();
            await buzzPage.verifySuccessToast();
            await buzzPage.verifyPost(postText);
        });
    });

    test('TC02 - Positive: Verify Engagement (Like and Comment) @regression', async ({ buzzPage }) => {
        const postText = `Engagement ${Date.now()}`;
        const comment = "Nice Update!";

        await test.step('Create and Like Post', async () => {
            await buzzPage.createPost(postText);
            await buzzPage.clickLikeOnPost(postText);
        });
        await test.step('Add Comment', async () => {
            await buzzPage.typeCommentOnPost(postText, comment);
            await buzzPage.verifySuccessToast();
        });
    });

    test('TC03 - Positive: Verify Engagement (Share) @regression', async ({ buzzPage }) => {
        const postText = `Engagement ${Date.now()}`;

        await test.step('Create and Share Post', async () => {
            await buzzPage.createPost(postText);
            await buzzPage.verifySuccessToast();
            await buzzPage.verifyPost(postText);
            await buzzPage.clickShareOnPost(postText);
            await buzzPage.verifySuccessToast();
        });
    });


    test('TC04 - Positive: Verify Edit Post @regression', async ({ buzzPage }) => {
        const original = `Original Text ${Date.now()}`;
        const updated = `Updated Text ${Date.now()}`;
        await test.step('Create Post', async () => {
            await buzzPage.createPost(original);
        });
        await test.step('Edit Post', async () => {
            await buzzPage.clickPostOptions(original);
            await buzzPage.clickEditOption();
            await buzzPage.editPostContent(updated);
            await buzzPage.verifySuccessToast();
            await buzzPage.verifyPost(updated);
        });
    });

    test('TC05 - Negative: Verify Cancellation of Post Deletion @regression', async ({ buzzPage }) => {
        const postText = `Safety Check ${Date.now()}`;
        
        await test.step('Create and Attempt Delete', async () => {
            await buzzPage.createPost(postText);
            await buzzPage.clickPostOptions(postText);
            await buzzPage.clickDeleteOption();
        });
        await test.step('Cancel Delete', async () => {
            await buzzPage.clickNoCancel();
            await buzzPage.verifyPost(postText);
        });
    });
});
