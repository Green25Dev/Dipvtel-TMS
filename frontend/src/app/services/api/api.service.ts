import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {StoreService} from "../store/store.service";
import {HttpClient} from "@angular/common/http";
import {IUser, IUserLogin, IUserToken, IRole, ICompany, ISomosUser} from "../../models/user";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import { getFilter, userKeys, getCountWhere } from '../../helper/utils'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private coreApi: string;

  constructor(private http: HttpClient, private store: StoreService) {
    this.coreApi = environment.base_uri;
  }

  public login(data: IUserLogin, rememberedIf: boolean): Observable<object> {
    return this.http.post<IUserToken>(`${this.coreApi}/authenticate`, data).pipe(
      tap(token => this.store.storeToken({ ...token, rememberedIf })),
      map(token => token)
    );
  }

  public logout(): Observable<any> {
    return this.http.post(`${this.coreApi}/de-authorization`, null);
  }

  public retrieveLoggedUserOb(token: IUserToken): Observable<IUser> {
    return this.getCurrentUser().pipe(tap(user => {
      // @ts-ignore
      const u = user.user;
      u.company = user.company;
      u.somos = user.somos;
      u.uiSettings = "{}";
      u.permissions = user.permissions;
      this.store.storeUser(u);
    }));
  }

  getCurrentUser(): Observable<IUser> {
    const url = `${this.coreApi}/authorization`;
    return this.http.get<IUser>(url);
  }

  //Company APIs
  getCompaniesList(active: string, direction: string, page: number, size: number, filterValue: string): Observable<ICompany[]> {
    const filter = getFilter(active, direction, size, page, filterValue, null, null, [
      'name', 
      'code', 
      'resp_org_id', 
      'role_code', 
      'company_email', 
      'address', 'city', 
      'state', 'zip_code', 
      'first_name', 
      'last_name',
      'contact_email',
      'contact_phone',
      'ro_id',
    ]);
    const url = `${this.coreApi}/companies?${filter !== 'filter=' ? filter + '&' : ''}`;
    return this.http.get<ICompany[]>(url);
  }

  getCompanyCount(filterValue: string, customerFilter?: any): Observable<any> {
    const whereParam = getCountWhere(filterValue, '', '', [], customerFilter);
    return this.http.get<any>(`${this.coreApi}/companies/count?${'where=' + whereParam}`);
  }

  createCompany(data: any): Observable<ICompany> {
    return this.http.post<ICompany>(`${this.coreApi}//companies`, data);
  }

  getCompany(id: number): Observable<ICompany> {
    const url = `${this.coreApi}/companies/${id}`;
    return this.http.get<ICompany>(url);
  }

  updateCompany(data: any): Observable<ICompany> {
    return this.http.patch<ICompany>(`${this.coreApi}/companies/${data.id}`, data);
  }

  deleteCompanyById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.coreApi}/companies/${id}`);
  }

  //Somos User APIs
  getSMSUserList(active: string, direction: string, page: number, size: number, filterValue: string): Observable<ISomosUser[]> {
    const filter = getFilter(active, direction, size, page, filterValue, null, null, [
      'username',
      'password',
      'client_key',
      'client_password',
    ]);
    const url = `${this.coreApi}/somos-users?${filter !== 'filter=' ? filter + '&' : ''}`;
    return this.http.get<ISomosUser[]>(url);
  }

  getSMSUserCount(filterValue: string, customerFilter?: any): Observable<any> {
    const whereParam = getCountWhere(filterValue, '', '', [], customerFilter);
    return this.http.get<any>(`${this.coreApi}/somos-users/count?${'where=' + whereParam}`);
  }

  createSMSUser(data: any): Observable<ISomosUser> {
    return this.http.post<ISomosUser>(`${this.coreApi}/somos-users`, data);
  }

  getSMSUser(id: number): Observable<ISomosUser> {
    const url = `${this.coreApi}/somos-users/${id}`;
    return this.http.get<ISomosUser>(url);
  }

  updateSMSUser(data: any): Observable<ISomosUser> {
    return this.http.patch<ISomosUser>(`${this.coreApi}/somos-users/${data.id}`, data);
  }

  deleteSMSUserById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.coreApi}/somos-users/${id}`);
  }

  getRolesList(active: string, direction: string, page: number, size: number, filterName: string, filterValue: string): Observable<IRole[]> {
    const filter = getFilter(active, direction, size, page, filterValue, null, null, userKeys);
    const url = `${this.coreApi}/roles?${filter !== 'filter=' ? filter + '&' : ''}`;
    return this.http.get<IRole[]>(url);
  }

}
