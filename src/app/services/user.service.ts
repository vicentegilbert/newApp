import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private storage: Storage) {
    this.init();
  }
  
  async init(){
    await this.storage.create();
    let admin = {
      "rut": "11111111-1",
      "name": "admin",
      "lastName":"",
      "gender": "Masculino",
      "dateOfBirth": "2006-06-06",
      "email": "admin@duocuc.cl",
      "password": "admin123456",
      "confirmPassword": "admin123456",
      "userType": "admin",
    };
    await this.createUser(admin);
  }

  public async createUser(user:any): Promise<boolean>{
    let users: any[] = await this.storage.get("users") || [];
    if(users.find(usu=>usu.rut==user.rut)!=undefined){
      return false;
    }
    users.push(user);
    await this.storage.set("users",users);
    return true;
  }

  public async getUser(rut:string): Promise<any>{
    let users: any[] = await this.storage.get("users") || [];
    return users.find(usu=>usu.rut==rut);
  }

  public async getUsers(): Promise<any[]>{
    let users: any[] = await this.storage.get("users") || [];
    return users;
  }

  public async updateUser(rut:string, newUser:any): Promise<boolean>{
    let users: any[] = await this.storage.get("users") || [];
    let indice: number = users.findIndex(usu=>usu.rut==rut);
    if(indice==-1){
      return false;
    }
    users[indice] = newUser;
    await this.storage.set("users",users);
    return true;
  }

  public async deleteUser(rut:string): Promise<boolean>{
    let users: any[] = await this.storage.get("users") || [];
    let indice: number = users.findIndex(usu=>usu.rut==rut);
    if(indice==-1){
      return false;
    }
    users.splice(indice,1);
    await this.storage.set("users",users);
    return true;
  }

  public async login(email: string, password: string): Promise<any>{
    let users: any[] = await this.storage.get("users") || [];
    const user =  users.find(elemento=> elemento.email==email && elemento.password==password);
    if(user){
      localStorage.setItem("user", JSON.stringify(user) );
      return true;
    }
    return false;
  }

  public async recoverPassword(email:string): Promise<any>{
    let users: any[] = await this.storage.get("users") || [];
    return users.find(elemento=> elemento.email == email);
  }
}
