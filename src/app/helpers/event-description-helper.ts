import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class EventDescriptionHelper {
  constructor(private translateService: TranslateService) {}

  setCollaboratorDescription(collaboratorDescription: { materials: string; onlineSession: string; otherModalities: string }): string {
    return `${collaboratorDescription.materials}|${collaboratorDescription.onlineSession}|${collaboratorDescription.otherModalities}`;
  }

  setEventDescription(description: string): { materials: string; onlineSession: string; otherModalities: string } {
    const collaboratorDescription: any = {};
    const splits = description.split('|');
    if (splits) {
      collaboratorDescription.materials = splits[0];
      collaboratorDescription.onlineSession = splits[1];
      collaboratorDescription.otherModalities = splits[2];
    }
    return collaboratorDescription;
  }

  setEventDescriptionText(description: string): string {
    const splits = description.split('|');
    return `${this.translateService.instant('event.collaborator.materialsText')}
            : ${splits[0]}. ${this.translateService.instant('event.collaborator.onlineSessionText')}
            : ${splits[1]}. ${this.translateService.instant('event.collaborator.otherModalitiesText')}: ${splits[2]}.`;
  }
}
