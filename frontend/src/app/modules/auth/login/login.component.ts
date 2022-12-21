import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {ROUTES} from "../../../app.routes";
import {Router} from "@angular/router";
import {StoreService} from "../../../services/store/store.service";
import {ApiService} from "../../../services/api/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private localdb: Storage = window.localStorage;
  public submitted = false;
  loginForm!: FormGroup

  blockContent = false

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private api: ApiService,
              private store: StoreService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.localdb.clear()
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberedIf: [false],
    });
  }

  get f() {
    return this.loginForm.controls;
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

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.blockContent = true

    this.submitted = true;
    this.api.login({ username: this.f.username.value, password: this.f.password.value }, this.f.rememberedIf.value).subscribe(async res => {
      this.blockContent = false

      if (res) {
        this.store.storePassword(this.f.password.value);
        await this.router.navigate([ROUTES.dashboard]);
      }

      this.showSuccess("User logged in successfully");
      this.submitted = false;
    }, (err: any) => {
      this.blockContent = false
      this.submitted = false;

      if (err.error?.error) {
        // @ts-ignore
        this.showWarn(err.error.error?.message);
        return;
      } else {
        this.showWarn(err?.message);
      }
    });
    // this.submitted = false;
  }

}
