// ✨ Bot Discord personnalisé pour Only Dream - Only Dream RP
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const {
    prefix,
    welcomeChannelId,
    authorizedUsers,
    avisChannelId,
    inviteChannelId,
    dmLogChannelId,
    token
} = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User]
});

const invites = new Map();
const penduWords = [
    { word: "discord", hint: "Plateforme de communication populaire" },
    { word: "moderation", hint: "Rôle clé pour maintenir l'ordre" },
    { word: "roleplay", hint: "Style de jeu sur Only Dream" },
    { word: "gta", hint: "Jeu emblématique avec du RP" },
    { word: "faction", hint: "Groupe de joueurs RP" },
    { word: "evenement", hint: "Organisé par le staff" },
    { word: "bot", hint: "Automatisation sur Discord" },
    { word: "serveur", hint: "Lieu communautaire en ligne" },
    { word: "police", hint: "FDO dans Only Dream" },
    { word: "voiture", hint: "Utilisée pour se déplacer" },
    { word: "banque", hint: "Lieu pour gérer son argent" },
    { word: "medecin", hint: "Profession pour soigner les joueurs" },
    { word: "armes", hint: "Utilisées pour se défendre" },
    { word: "radio", hint: "Utilisée pour la communication FDO" },
    { word: "ambulance", hint: "Véhicule médical" },
    { word: "admin", hint: "Membre du staff" },
    { word: "garage", hint: "Pour stocker son véhicule" },
    { word: "telephone", hint: "Utilisé pour appeler ou envoyer des messages" },
    { word: "illégal", hint: "Activité en dehors des lois RP" },
    { word: "legal", hint: "Activité autorisée dans le serveur" },
    { word: "prison", hint: "Endroit où on va si on est arrêté" },
    { word: "casier", hint: "Peut contenir un historique judiciaire" },
    { word: "recrutement", hint: "Processus pour rejoindre une faction" },
    { word: "script", hint: "Fonctionnalité ajoutée au serveur" },
    { word: "uniforme", hint: "Tenue officielle d’un service" },
    { word: "vehicule", hint: "Moyen de transport motorisé" },
    { word: "deal", hint: "Échange de produits illégaux" },
    { word: "braquage", hint: "Action criminelle organisée" }
];

client.once('ready', async () => {
    console.log(`🚀 Bot connecté en tant que ${client.user.tag}`);
    client.user.setActivity('Only Dream 🌴 | RP', { type: 'PLAYING' });

    const guild = client.guilds.cache.first();
    if (guild) {
        try {
            const guildInvites = await guild.invites.fetch();
            invites.set(guild.id, guildInvites);
        } catch (err) {
            console.warn("⚠️ Impossible de fetch les invitations au démarrage :", err.message);
        }
    }
});

client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (channel) {
        const embed = new EmbedBuilder()
            .setTitle('👋 Bienvenue sur Only Dream RP !')
            .setDescription(`Bienvenue à toi ${member.user}, prépare-toi à vivre une expérience RP inoubliable 🌴 !`)
            .setColor(0x2ecc71)
            .setFooter({ text: 'Rejoins une faction, explore la ville et écris ton histoire.' });
        channel.send({ embeds: [embed] });
    }

    try {
        const newInvites = await member.guild.invites.fetch();
        const oldInvites = invites.get(member.guild.id);
        const invite = newInvites.find(i => {
            const old = oldInvites.get(i.code);
            return old && i.uses > old.uses;
        });
        invites.set(member.guild.id, newInvites);

        const inviteLog = member.guild.channels.cache.get(inviteChannelId);
        if (inviteLog && invite) {
            const inviteEmbed = new EmbedBuilder()
                .setTitle('📥 Nouvelle invitation')
                .setDescription(`${member.user.tag} a été invité(e) par **${invite.inviter.tag}**\n🔗 Code : ${invite.code} | Utilisations : ${invite.uses}`)
                .setColor(0x95a5a6);
            inviteLog.send({ embeds: [inviteEmbed] });
        }
    } catch (err) {
        console.warn("⚠️ Impossible de détecter l'invitation utilisée :", err.message);
    }
});

client.on('messageCreate', async message => {
    if (message.channel.type === 1 && !message.author.bot) {
        const logChannel = client.channels.cache.get(dmLogChannelId);
        if (logChannel) {
            logChannel.send(`📩 **@${message.author.tag}** a envoyé dans les messages :\n\`\`\`${message.content}\`\`\``);
        }
        return;
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'reglement') {
        const embed = new EmbedBuilder()
            .setTitle('📜 Règlement du serveur Discord - Only Dream RP')
            .setDescription('Merci de lire attentivement ce règlement et de le respecter afin de garantir une ambiance saine, conviviale et immersive sur le serveur Discord **Only Dream RP 🌴**.')
            .addFields(
                { name: '1. 🤝 Respect & Convivialité', value: 'Aucune insulte, menace ou discrimination.' },
                { name: '2. 🎭 Rôle-play (RP)', value: 'Restez en personnage en scène RP.' },
                { name: '3. 🚫 Triche, Troll & Abus', value: 'Cheat et troll interdits.' },
                { name: '4. 🛠️ Staff & Sanctions', value: 'Les décisions du staff sont finales.' },
                { name: '5. 🔇 Spam, Flood & Publicité', value: 'Pas de spam ou pub sans autorisation.' },
                { name: '6. 📢 Canaux & Comportement', value: 'Utilisez les salons comme prévu.' },
                { name: '7. 🔞 Contenus inappropriés', value: 'Pas de contenus choquants.' },
                { name: '8. 📁 Noms, Avatars & Pseudos RP', value: 'Doivent rester corrects.' },
                { name: '9. 🎧 Utilisation des vocaux', value: 'Pas de perturbation audio.' },
                { name: '10. ⚖️ Rappel', value: 'Ignorer le règlement n’est pas une excuse.' }
            )
            .setColor(0xffcc00)
            .setFooter({ text: 'Only Dream RP - Règlement officiel', iconURL: client.user.displayAvatarURL() });
        return message.channel.send({ embeds: [embed] });
    }

    if (command === 'help') {
        const embed = new EmbedBuilder()
            .setTitle('📘 Commandes du bot')
            .setDescription('Voici les commandes disponibles sur le serveur Discord Only Dream 🌴')
            .addFields(
                { name: '!reglement', value: 'Affiche le règlement Discord.' },
                { name: '!boutique', value: 'Affiche le lien vers la boutique Only Dream.' },
                { name: '!info', value: 'Affiche des infos sur le serveur.' },
                { name: '!jeux', value: 'Ouvre le menu des jeux (ex : pendu).' }
            )
            .setColor(0x00bfff)
            .setFooter({ text: 'Support officiel : https://discord.gg/zHwcSamFeW' });
        return message.channel.send({ embeds: [embed] });
    }

    if (command === 'info') {
        const embed = new EmbedBuilder()
            .setTitle('ℹ️ Bot - Only Dream')
            .setDescription('Ce bot Discord est conçu pour améliorer votre expérience sur le serveur GTA RP **Only Dream 🌴**.')
            .addFields(
                { name: 'Créateur', value: 'ZyLoFnV2' },
                { name: 'Type de serveur', value: 'RP US avec scripts inédits' }
            )
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(0xa29bfe);
        return message.channel.send({ embeds: [embed] });
    }
    if (command === 'dm') {
        if (!authorizedUsers.includes(message.author.id)) {
            return message.reply("❌ Tu n'es pas autorisé à utiliser cette commande.");
        }

        const target = args.shift();
        const content = args.join(" ");

        if (!target || !content) return message.reply("❌ Utilisation : `!dm <id/mention/all> <message>`");

        let user;
        try {
            if (target.toLowerCase() === 'all') {
                const members = await message.guild.members.fetch();
                let success = 0;
                for (const [, member] of members) {
                    if (!member.user.bot) {
                        try {
                            await member.send(content);
                            success++;
                        } catch {}
                    }
                }
                return message.channel.send(`✅ Message envoyé à ${success} membres (hors bots).`);
            }

            if (message.mentions.users.size) {
                user = message.mentions.users.first();
            } else {
                user = await client.users.fetch(target);
            }

            if (!user) throw new Error();

            await user.send(content);
            return message.channel.send(`✅ Message envoyé à <@${user.id}>.`);
        } catch {
            return message.channel.send("❌ Impossible d'envoyer le message. ID incorrect ou DMs désactivés.");
        }
    }
    if (command === 'jeux') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('pendu')
                .setLabel('🪓 Jouer au Pendu')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('soon')
                .setLabel('🔒 Autres jeux bientôt')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
        );

        const jeuxEmbed = new EmbedBuilder()
            .setTitle('🎮 Menu des Jeux - Only Dream')
            .setDescription('Clique sur un jeu pour commencer !')
            .setColor(0xff6b81);

        const jeuxMessage = await message.channel.send({ embeds: [jeuxEmbed], components: [row] });

        const collector = jeuxMessage.createMessageComponentCollector({ time: 15000 });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'pendu') {
                const random = penduWords[Math.floor(Math.random() * penduWords.length)];
                const word = random.word.toLowerCase();
                const hint = random.hint;
                let display = word.replace(/./g, '_');
                let tries = 6;
                let guessed = [];

                await interaction.reply(`🎯 Mot à deviner : \`${display.split('').join(' ')}\`\n💡 Indice : ${hint}\n✏️ Tape une lettre.`);

                const filter = m => m.author.id === interaction.user.id;
                const msgCollector = message.channel.createMessageCollector({ filter, time: 60000 });

                msgCollector.on('collect', m => {
                    const letter = m.content.toLowerCase();
                    if (letter.length !== 1 || !/[a-z]/.test(letter)) return;

                    if (guessed.includes(letter)) return;
                    guessed.push(letter);

                    if (word.includes(letter)) {
                        display = word.split('').map(l => guessed.includes(l) ? l : '_').join('');
                    } else {
                        tries--;
                    }

                    if (display === word) {
                        msgCollector.stop();
                        return message.channel.send(`🎉 Bravo ${interaction.user}! Le mot était \`${word}\`.`);
                    } else if (tries === 0) {
                        msgCollector.stop();
                        return message.channel.send(`💀 Tu as perdu ${interaction.user} ! Le mot était \`${word}\`.`);
                    } else {
                        message.channel.send(`🧩 \`${display.split('').join(' ')}\` | ✏️ Lettre: ${letter} | ❤️ Vies restantes: ${tries}`);
                    }
                });

                msgCollector.on('end', () => {
                    if (display !== word) {
                        message.channel.send(`⌛ Temps écoulé ! Le mot était \`${word}\`.`);
                    }
                });
            }
        });
    }
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

client.login(token);

// (Créé par ZyLoFnV2) | Only Dream RP 🌴