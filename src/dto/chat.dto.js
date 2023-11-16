export default class ChatDTO {
    constructor( chat ) {
        this.user = chat.user;
        this.message = chat.message;
    }
}