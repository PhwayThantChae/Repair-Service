export class service_provider{

    constructor(
        public name:string,
        public branch:string,
        public username:string,
        public password:string,
        public ph:string[],
        public township: string,
        public address:string,
        public services:string[],
        public emergency:boolean,
        public license?:string,
        public hotline?:string[],
        public email?: string[]
    ){

    }

}