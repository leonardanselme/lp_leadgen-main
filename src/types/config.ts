//Définit un type Mailgun qui spécifie tous les paramètres nécessaires pour configurer Mailgun

export type MailgunConfig = {
  subdomain: string;
  fromNoReply: string;
  fromAdmin: string;
  supportEmail?: string;
  forwardRepliesTo?: string;
};
