import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {TicketsService} from "../../core/services/zendesk/tickets.service";
import { LoginComponent } from 'src/app/auth/login/login.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  // Parent's component interaction
  @Output() setOpenTickets = new EventEmitter<any>();
  @Output() buildMessage = new EventEmitter<any>();
  @Input() openTickets: any | undefined;

  constructor(private zendeskService: TicketsService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getOpenTickets()
  }

  /**
   * [Get the open tickets from a specified email]
   * */
  getOpenTickets(){
    this.dialog.open(LoginComponent, {
    });

    // @ts-ignore
    this.zendeskService.getOpenTickets("j.grimshaw@iicom.org").subscribe(({tickets}) => {
      this.setOpenTickets.emit(tickets.results);
      console.log(tickets)
      this.buildMessage.emit({text:'', reply:false, type:'custom-ticket-list-view'})
    })
  }

  // TODO: show response if ticket has response
  /**
   * [Sends a message with the content of a ticket]
   * */
  getSpecificTicket(index: number){
    this.buildMessage.emit({text: '', reply: false, type: 'custom-specific-ticket-view', customMessageData:
      {title: this.openTickets[index].subject, date: this.openTickets[index].created_at,
        description: this.openTickets[index].description, priority: this.openTickets[index].priority}})
  }

}
