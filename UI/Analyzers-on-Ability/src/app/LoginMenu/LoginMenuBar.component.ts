import { environment } from './../../environments/environment';
import {Component} from '@angular/core';

/**
 * @title Basic menu
 */
@Component({
  selector: 'LoginMenuBarComponent',
  templateUrl: 'LoginMenuBar.component.html',
  styleUrls:['./../MenuBar/Menu.component.css']
  
})
export class LoginMenuBarComponent {
  public title:string = environment.title;
}