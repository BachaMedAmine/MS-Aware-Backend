import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historique } from './schema/historique.entity';
import { HistoriqueService } from './historique.service'; // ✅ import
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class PainCheckService {
  constructor(
    @InjectModel(Historique.name) private readonly historiqueModel: Model<Historique>,
    private readonly historiqueService: HistoriqueService,
    private readonly notificationService: NotificationService
  ) { }

  // @Cron('0 /5 * ') Every 5 hours
  @Cron('0 * * * * *') // Every Minute
  async followUpPain() {
    const now = new Date();
    const cinqHeuresAvant = new Date(now.getTime() - (5 * 60 * 1000));

    const douleurs = await this.historiqueModel.find({
      isActive: true,
      lastCheckTime: { $lte: cinqHeuresAvant },
    });

    for (const douleur of douleurs) {
      douleur.needsPainCheck = true;
      if (douleur.fcmToken) {
        await this.historiqueService.sendNotification(douleur.fcmToken, "⌛ Health Check", " You passed 5 hours already, tell us how are you feeling now !");
        await this.notificationService.addNotification({ title: "⌛ Health Check", message: "You passed 5 hours already, tell us how are you feeling now !" }, douleur.user.toString() );
      }
      await douleur.save();
    }
  }

  //Pain has passed 24 HOURS
  //@Cron(CronExpression.EVERY_30_MINUTES)
  async checkPainFollowUps() {
    const now = new Date();
    const vingtQuatreHeuresAvant = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    const longuesDouleurs = await this.historiqueModel.find({
      isActive: true,
      startTime: { $lte: vingtQuatreHeuresAvant },
    });

    for (const douleur of longuesDouleurs) {

      douleur.isActive = false;
      douleur.endTime = now; 
      douleur.wasOver24h = true;

      if (douleur.fcmToken) {
        await this.historiqueService.sendNotification(douleur.fcmToken, "🚨 Health Alert", " You have passed the 24 hours and you must see your doctor !");
        await this.notificationService.addNotification({ title: "🚨 Health Alert", message: "You have passed the 24 hours and you must see your doctor !" }, douleur.user.toString() );
      }

      await douleur.save();
    }
  }

  //When the user is ignoring the notification
  //@Cron(CronExpression.EVERY_30_MINUTES)
  @Cron(CronExpression.EVERY_MINUTE)
  async alertPain() {
    const now = new Date();

    const longuesDouleurs = await this.historiqueModel.find({
      wasOver24h: true,
    });

    for (const douleur of longuesDouleurs) {

      if (douleur.fcmToken) {
        await this.historiqueService.sendNotification(douleur.fcmToken, "🚨 Emergency", "You are taking danger by ignoring the pain, Please check your doctor now !");
        await this.notificationService.addNotification({ title: "🚨 Emergency", message: "You are taking danger by ignoring the pain, Please check your doctor now !" }, douleur.user.toString() );
      }

      await douleur.save();
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
async notifyStableAfterEndTime() {
  const now = new Date();
  const uneMinuteAvant = new Date(now.getTime() - 60 * 1000); // Douleurs clôturées il y a moins d'1 minute

  const recentlyEnded = await this.historiqueModel.find({
    isActive: true,
    endTime: { $gte: uneMinuteAvant }, // endTime vient d'être ajouté
  });

  for (const douleur of recentlyEnded) {
    if (douleur.fcmToken) {
      await this.historiqueService.sendNotification(
        douleur.fcmToken,
        "✅ You are stable",
        "Your pain episode has ended. Stay vigilant and healthy!"
      );

      await this.notificationService.addNotification(
        {
          title: "✅ You are stable",
          message: "Your pain episode has ended. Stay vigilant and healthy!"
        },
        douleur.user.toString()
      );
    }

    douleur.isActive = false;
    douleur.lastCheckTime = now;
    await douleur.save();
  }
}
}