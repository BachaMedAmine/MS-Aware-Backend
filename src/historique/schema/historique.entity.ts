import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';


@Schema({ timestamps: true })
export class Historique extends Document {
@Prop({ required: true })
imageUrl: string; // Lien de l’image capturée

@Prop({
type: Object,
required: true,
})
generatedDescription: {
fr: string;
en: string;
};

@Prop({ type: Types.ObjectId, ref: 'User', required: true })
user: User; // Référence à l’utilisateur

@Prop()
bodyPartName?: string;

@Prop({ type: [Number] })
bodyPartIndex?: number[];

@Prop()
createdAt?: Date;

@Prop({ default: false })
isActive: boolean; // Pour savoir si la douleur est encore en cours

@Prop()
startTime?: Date; // Heure exacte où la douleur a commencé

@Prop()
endTime?: Date; // Heure exacte où elle a été stoppée (si applicable)

@Prop()
lastCheckTime?: Date; // La dernière fois qu'on a vérifié via pop-up

@Prop({ default: false })
needsPainCheck: boolean; // pour signaler que Flutter doit demander confirmation

@Prop({ default: false })
wasOver24h?: boolean; //  Si la douleur a dépassé 24h

@Prop()
fcmToken: string
}

export const HistoriqueSchema = SchemaFactory.createForClass(Historique);