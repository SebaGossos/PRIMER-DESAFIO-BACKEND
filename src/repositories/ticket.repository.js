export default class TicketRepositoy {
    constructor( dao ) {
        this.dao = dao;
    }

    purchase = async( cid, email ) => await this.dao.purchase( cid, email );
}