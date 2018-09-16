import { observable, action, computed } from 'mobx'

class Store {
    @observable username = ''
    @observable user = {}
    @observable Gif = ''
    @observable List = {}


}

export default new Store()
