import { Page, expect, Locator } from '@playwright/test';
import { CommonPage } from './CommonPage';

export class BuzzPage extends CommonPage {

    readonly postInput: Locator;
    readonly postButton: Locator;
    readonly buzzPostCard: Locator;
    readonly postOptionsButton: Locator;
    readonly menu: Locator;
    readonly dialogSheet: Locator;
    readonly postSheet: Locator;
    readonly postBodyText: Locator;
    readonly likeIcon: Locator;
    readonly commentIcon: Locator;
    readonly shareIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.postInput = page.locator('.oxd-buzz-post-input');
        this.postButton = page.getByRole('button', { name: 'Post', exact: true });
        this.buzzPostCard = page.locator('.orangehrm-buzz');
        this.postOptionsButton = page.locator('.bi-three-dots');
        this.menu = page.getByRole('menu');
        this.dialogSheet = page.locator('.oxd-dialog-sheet');
        this.postSheet = page.locator('.oxd-sheet');
        this.postBodyText = page.locator('.orangehrm-buzz-post-body-text');
        this.likeIcon = page.locator('#heart-svg');
        this.commentIcon = page.locator('.bi-chat-text-fill');
        this.shareIcon = page.locator('.bi-share-fill');
    }

    async createPost(postText: string) {
        await this.postInput.fill(postText);
        await this.postButton.click();
        return this;
    }

    async clickPostOptions(postText: string) {
        const postCard = this.buzzPostCard.filter({ hasText: postText }).first();
        const optionsButton = postCard.locator(this.postOptionsButton);
        await this.click(optionsButton, 'Post Options Button');
        return this;
    }

    async clickDeleteOption() {
        await this.menu.waitFor({ state: 'visible' });
        const deletePost = this.menu.getByText('Delete Post');
        await this.click(deletePost, 'Delete Post Button');
        return this;
    }

    async clickEditOption() {
        await this.menu.waitFor({ state: 'visible' });
        const editPost = this.menu.getByText('Edit Post');
        await this.click(editPost, "Edit Post Button");
        return this;
    }

    async editPostContent(newText: string) {
        await expect(this.dialogSheet).toBeVisible();
        const inputField = this.dialogSheet.locator(this.postInput);
        await inputField.fill(newText);
        await this.dialogSheet.locator(this.postButton).click();
        return this;
    }

    async verifyPost(text: string) {
        const postCard = this.postSheet.filter({ hasText: text }).first();
        await expect(postCard).toBeVisible();
        const postContent = postCard.locator(this.postBodyText);
        await expect(postContent).toHaveText(text);
        return this;
    } 

    async clickLikeOnPost(postText: string) {
        const post = this.buzzPostCard.filter({ hasText: postText }).first();
        await post.locator(this.likeIcon).click();
        return this;
    }

    async typeCommentOnPost(postText: string, comment: string) {
        const postCard = this.postSheet.filter({ hasText: postText }).first();
        await postCard.locator(this.commentIcon).click();
        const commentInput = postCard.getByPlaceholder('Write your comment...');
        await commentInput.waitFor({ state: 'visible' });
        await commentInput.fill(comment);
        await this.page.keyboard.press('Enter');
        return this;
    }

    async clickShareOnPost(postText: string) {
        const postCard = this.buzzPostCard.filter({ hasText: postText }).first();
        await postCard.locator(this.shareIcon).click();
        await this.dialogSheet.locator(this.postButton).click();
        return this;
    }

}
