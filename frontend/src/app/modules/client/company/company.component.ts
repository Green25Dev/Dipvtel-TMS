import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {MessageService} from "primeng/api";
import {ApiService} from "../../../services/api/api.service";
import {StoreService} from "../../../services/store/store.service";
import { TMSUserType, NoPermissionAlertInteral, PERMISSION_TYPE_DENY, PERMISSION_TYPE_ALL, PERMISSION_TYPE_READONLY } from '../../constants';
import { tap } from "rxjs/operators";
import moment from 'moment';
import {ICompany} from "../../../models/user";
import { GuiVisibility } from '../../../models/gui';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  permission = PERMISSION_TYPE_ALL

  permissionTypeAll = PERMISSION_TYPE_ALL
  permissionTypeReadOnly = PERMISSION_TYPE_READONLY

  // users variables
  pageSize = 15
  pageIndex = 1
  companies: any[] = []
  filterName = ''
  filterValue = ''
  sortActive = ''
  sortDirection = ''
  resultsLength = -1
  isLoading = true
  noNeedRemoveColumn = true

  noNeedEditColumn = false

  flag_openDialog = false

  //company items
  input_name: string|undefined|null = ''
  input_code: string|undefined|null = ''
  input_role_code: string|undefined|null = ''
  input_resp_org_id: string|undefined|null = ''
  input_company_email: string|undefined|null = ''
  input_address: string|undefined|null = ''
  input_city: string|undefined|null = ''
  input_state: string|undefined|null = ''
  input_zip_code: string|undefined|null = ''
  input_first_name: string|undefined|null = ''
  input_last_name: string|undefined|null = ''
  input_contact_email: string|undefined|null = ''
  input_contact_phone: string|undefined|null = ''
  input_ro_id: string|undefined|null = ''

  modalTitle = '';

  clickedId = -1;

  constructor(
    public api: ApiService,
    public store: StoreService,
    private messageService: MessageService,
    private location: Location
  ) { }

  async ngOnInit() {
    
    await new Promise<void>(resolve => {
      let mainUserInterval = setInterval(() => {
        if (this.store.getUser()) {
          clearInterval(mainUserInterval)

          resolve()
        }
      }, 100)
    })

    /**************************** permission checking *************************/
    // if (this.store.getUserType() != TMSUserType.superAdmin) {
    //   let guiVisibility: GuiVisibility[] = this.store.getGuiVisibility()


    //   this.permission = PERMISSION_TYPE_DENY
    //   for (let v of guiVisibility) {
    //     if (v.GuiSection.name == "Role") {
    //       this.permission = v.GuiPermission.name
    //       break
    //     }
    //   }

    //   if (this.permission == PERMISSION_TYPE_DENY) {
    //     this.showWarn("You have no permission for this page")
    //     await new Promise<void>(resolve => { setTimeout(() => { resolve() }, NoPermissionAlertInteral) })
    //     this.location.back()
    //   }

    // }

    this.getCompaniesList();
  }

  getCompaniesList = async () => {
    this.isLoading = true;
    try {

      let filterValue = this.filterValue.replace('(', '').replace('-', '').replace(') ', '').replace(')', '')

      // if (this.store.getUserType() != TMSUserType.superAdmin) {
      //   if (filterValue != '')
      //     filterValue += ','
      //   filterValue += 'customerId:"' + this.store.getUser().customerId + '"'
      // }

      // tslint:disable-next-line: max-line-length
      await this.api.getCompaniesList(this.sortActive, this.sortDirection, this.pageIndex, this.pageSize, filterValue)
        .pipe(tap(async (companiesRes: ICompany[]) => {
          this.companies = [];
          companiesRes.map(u => u.created_at = u.created_at ? moment(new Date(u.created_at)).format('YYYY/MM/DD h:mm:ss A') : '');
          companiesRes.map(u => u.updated_at = u.updated_at ? moment(new Date(u.updated_at)).format('YYYY/MM/DD h:mm:ss A') : '');

          let allNotEditable = true
          for (let company of companiesRes) {
            this.companies.push(company)
          }

          this.noNeedEditColumn = allNotEditable

        })).toPromise();

      this.resultsLength = -1
      await this.api.getCompanyCount(filterValue, {})
        .pipe(tap( res => {
          this.resultsLength = res.count
        })).toPromise();
    } catch (e) {
    } finally {
      setTimeout(() => this.isLoading = false, 1000);
    }
  }

  onSortChange = async (name: any) => {
    this.sortActive = name;
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.pageIndex = 1;
    await this.getCompaniesList();
  }

  onFilter = (event: Event) => {
    this.pageIndex = 1;
    this.filterName = (event.target as HTMLInputElement).name;
    this.filterValue = (event.target as HTMLInputElement).value;
  }

  onClickFilter = () => this.getCompaniesList();

  onPagination = async (pageIndex: any) => {
    const totalPageCount = Math.ceil(this.resultsLength / this.pageSize);
    if (pageIndex === 0 || pageIndex > totalPageCount) { return; }
    if (pageIndex === this.pageIndex) {return;}
    this.pageIndex = pageIndex;
    await this.getCompaniesList();
  }

  paginate = (event: any) => {
    this.onPagination(event.page+1);
  }

  openCompanyModal = (modal_title: string) => {
    this.modalTitle = modal_title
    this.flag_openDialog = true
  }

  closeCompanyModal = () => {
    this.clearInputs();
    this.flag_openDialog = false;
  }

  onCompanySubmit = async (form_values: any) => {
    let name = form_values.name;
    let role_code = form_values.role_code;
    let company_email = form_values.company_email;
    let city = form_values.city;
    let zip_code = form_values.zip_code;
    let code = form_values.code;
    let resp_org_id = form_values.resp_org_id;
    let address = form_values.address;
    let state = form_values.state;
    let first_name = form_values.first_name;
    let contact_email = form_values.contact_email;
    let ro_id = form_values.ro_id;
    let last_name = form_values.last_name;
    let contact_phone = form_values.contact_phone;

    if(name==''||code==''||resp_org_id==''||role_code==''||company_email==''||first_name==''||last_name==''||ro_id=='') {
      // this.showWarn('Please inputs')
      return;
    }

    await new Promise<void>(resolve => {
      this.api.createCompany({
        name: name,
        role_code: role_code,
        company_email: company_email,
        city: city,
        zip_code: zip_code,
        code: code,
        resp_org_id: resp_org_id,
        address: address,
        state: state,
        first_name: first_name,
        contact_email: contact_email,
        ro_id: ro_id,
        last_name: last_name,
        contact_phone: contact_phone,
        status: true,
        created_by: 0,
        updated_by: 0,
        created_at: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
        updated_at: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      }).subscribe(res => {
        resolve()
      });
    })

    this.showSuccess('Company successfully created!');
    this.closeCompanyModal();
    this.getCompaniesList();
  }

  viewCompany = (event: Event, company_id: number) => {
    this.clickedId = company_id;
  }


  onOpenEditModal = async (event: Event, company_id: number) => {
    this.clickedId = company_id;
    this.api.getCompany(company_id).subscribe(async res => {
      this.input_name = res.name;
      this.input_code = res.code;
      this.input_role_code = res.role_code;
      this.input_resp_org_id = res.resp_org_id;
      this.input_company_email = res.company_email;
      this.input_address = res.address;
      this.input_city = res.city;
      this.input_state = res.state;
      this.input_zip_code = res.zip_code;
      this.input_first_name = res.first_name;
      this.input_last_name = res.last_name;
      this.input_contact_email = res.contact_email;
      this.input_contact_phone = res.contact_phone;
      this.input_ro_id = res.ro_id;

      this.openCompanyModal('Edit');
    })
  }

  editCompany = () => {
    this.api.updateCompany({
      id: this.clickedId,
      name: this.input_name,
      role_code: this.input_role_code,
      company_email: this.input_company_email,
      city: this.input_city,
      zip_code: this.input_zip_code,
      code: this.input_code,
      resp_org_id: this.input_resp_org_id,
      address: this.input_address,
      state: this.input_state,
      first_name: this.input_first_name,
      contact_email: this.input_contact_email,
      ro_id: this.input_ro_id,
      last_name: this.input_last_name,
      contact_phone: this.input_contact_phone,
      status: true,
      created_by: 0,
      updated_by: 0,
      created_at: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      updated_at: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }).subscribe(res => {
      this.showSuccess('Company update succeeded!');
      this.closeCompanyModal();
      this.getCompaniesList();
    });
  }

  deleteCompany = (event: Event, company_id: number) => {
    this.clickedId = company_id;
    if(confirm('Are you sure you want to delete this company?') == true) {
      this.api.deleteCompanyById(company_id).subscribe(res => {
        this.showSuccess('Role successfully deleted!')
        this.getCompaniesList();
      })
    } else {
        
    }
  }

  clearInputs = () => {
    this.input_name = ''
    this.input_code = ''
    this.input_role_code = ''
    this.input_resp_org_id = ''
    this.input_company_email = ''
    this.input_address = ''
    this.input_city = ''
    this.input_state = ''
    this.input_zip_code = ''
    this.input_first_name = ''
    this.input_last_name = ''
    this.input_contact_email = ''
    this.input_contact_phone = ''
    this.input_ro_id = ''
  }

  showWarn = (msg: string) => {
    this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Warning', detail: msg });
  }
  showError = (msg: string) => {
    this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: msg });
  }
  showSuccess = (msg: string) => {
    this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success', detail: msg });
  };

}
