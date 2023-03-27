import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {TicketsService} from "../../core/services/zendesk/tickets.service";
import {LoginComponent} from 'src/app/auth/login/login.component';
import {MatDialog} from '@angular/material/dialog';
import {SupportComponent} from "../support/support.component";

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  // Parent's component interaction
  @ViewChild(SupportComponent) public sc: SupportComponent | undefined;
  @Output() setOpenTickets = new EventEmitter<any>();
  @Output() buildMessage = new EventEmitter<any>();
  @Input() openTickets: any | undefined;
  @Input() token: any;
  @Input() userId: any;
  @Input() email: any;

  constructor(private zendeskService: TicketsService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getOpenTickets()
  }

  /**
   * [Get the open tickets from a specified email]
   * */
  getOpenTickets(){
    // If there's no token and user ID then open login form
    if (!(this.token && this.userId)){
      let dialogRef = this.dialog.open(LoginComponent, {
      });

      dialogRef.afterClosed().subscribe((res) => {
        this.showOpenTickets()
      })
    }
    else {
      this.showOpenTickets()
    }
  }

  showOpenTickets(){
    // @ts-ignore
    this.zendeskService.getOpenTickets(this.email).subscribe(({tickets}) => {
      this.setOpenTickets.emit(tickets.results);

      if (this.openTickets.length > 0){
        this.buildMessage.emit({text: 'Open tickets, click each ticket to see content', reply: false})
        this.buildMessage.emit({text:'', reply:false, type:'custom-ticket-list-view'})
      }
      else {
        this.buildMessage.emit({text: 'There are no open tickets at the moment', reply: false})
        this.buildMessage.emit({text:'', reply:false, type:'custom-ticket-list-view'})
      }
    })
  }

  /**
   * [Sends a message with the content of a ticket]
   * */
  getSpecificTicket(index: number){
    this.buildMessage.emit({text: '', reply: false, type: 'custom-specific-ticket-view', customMessageData:
      {title: this.openTickets[index].subject, date: this.openTickets[index].created_at,
        description: this.openTickets[index].description, priority: this.openTickets[index].priority}})
  }
}
