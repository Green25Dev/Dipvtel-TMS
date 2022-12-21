import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {MessageService} from "primeng/api";
import {ApiService} from "../../../services/api/api.service";
import {StoreService} from "../../../services/store/store.service";
import { TMSUserType, NoPermissionAlertInteral, PERMISSION_TYPE_DENY, PERMISSION_TYPE_ALL, PERMISSION_TYPE_READONLY } from '../../constants';
import { tap } from "rxjs/operators";
import moment from 'moment';
import { IRole} from "../../../models/user";
import { GuiVisibility } from '../../../models/gui';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  permission = PERMISSION_TYPE_ALL

  permissionTypeAll = PERMISSION_TYPE_ALL
  permissionTypeReadOnly = PERMISSION_TYPE_READONLY

  // roles variables
  pageSize = 15
  pageIndex = 1
  roles: any[] = []
  filterName = ''
  filterValue = ''
  sortActive = ''
  sortDirection = ''
  resultsLength = -1
  isLoading = true
  noNeedRemoveColumn = true

  noNeedEditColumn = false

  flag_openDialog = false

  //role items
  input_name: string|undefined|null = ''
  input_description: string|undefined|null = ''

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

    this.getRolesList();
  }

  getRolesList = async () => {
    this.isLoading = true;
    try {

      let filterValue = this.filterValue.replace('(', '').replace('-', '').replace(') ', '').replace(')', '')

      await this.api.getRolesList(this.sortActive, this.sortDirection, this.pageIndex, this.pageSize, filterValue)
        .pipe(tap(async (rolesRes: IRole[]) => {
          this.roles = [];
          rolesRes.map(u => u.created_at = u.created_at ? moment(new Date(u.created_at)).format('YYYY/MM/DD h:mm:ss A') : '');
          rolesRes.map(u => u.updated_at = u.updated_at ? moment(new Date(u.updated_at)).format('YYYY/MM/DD h:mm:ss A') : '');

          let allNotEditable = true
          for (let role of rolesRes) {
            this.roles.push(role)
          }

          this.noNeedEditColumn = allNotEditable

        })).toPromise();

      this.resultsLength = -1
      await this.api.getRoleCount(filterValue, {})
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
    await this.getRolesList();
  }

  onFilter = (event: Event) => {
    this.pageIndex = 1;
    this.filterName = (event.target as HTMLInputElement).name;
    this.filterValue = (event.target as HTMLInputElement).value;
  }

  onClickFilter = () => this.getRolesList();

  onPagination = async (pageIndex: any) => {
    const totalPageCount = Math.ceil(this.resultsLength / this.pageSize);
    if (pageIndex === 0 || pageIndex > totalPageCount) { return; }
    if (pageIndex === this.pageIndex) {return;}
    this.pageIndex = pageIndex;
    await this.getRolesList();
  }

  paginate = (event: any) => {
    this.onPagination(event.page+1);
  }

  openRoleModal = (modal_title: string) => {
    this.modalTitle = modal_title
    this.flag_openDialog = true
  }

  closeRoleModal = () => {
    this.clearInputs();
    this.flag_openDialog = false;
  }

  onRoleSubmit = async (form_values: any) => {
    let name = form_values.name;
    let description = form_values.description;

    if(name=='') {
      // this.showWarn('Please inputs')
      return;
    }

    await new Promise<void>(resolve => {
      this.api.createRole({
        name: name,
        description: description,
        created_by: 0,
        updated_by: 0,
        created_at: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
        updated_at: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
      }).subscribe(res => {
        resolve()
      });
    })

    this.showSuccess('Role successfully created!');
    this.closeRoleModal();
    this.getRolesList();
  }

  viewRole = (event: Event, role_id: number) => {
    this.clickedId = role_id;
  }

  onOpenEditModal = async (event: Event, role_id: number) => {
    this.clickedId = role_id;
    this.api.getRole(role_id).subscribe(async res => {
      this.input_name = res.name;
      this.input_description = res.description;

      this.openRoleModal('Edit');
    })
  }

  editRole = () => {
    this.api.updateRole({
      id: this.clickedId,
      name: this.input_name,
      description: this.input_description,
      created_by: 0,
      updated_by: 0,
      created_at: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
      updated_at: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    }).subscribe(res => {
      this.showSuccess('Role update succeeded!');
      this.closeRoleModal();
      this.getRolesList();
    });
  }

  deleteRole = (event: Event, role_id: number) => {
    this.clickedId = role_id;
    if(confirm('Are you sure you want to delete this role?') == true) {
      this.api.deleteRoleById(role_id).subscribe(res => {
        this.showSuccess('Role successfully deleted!')
        this.getRolesList();
      })
    } else {
        
    }
  }

  clearInputs = () => {
    this.input_name = ''
    this.input_description = ''
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
