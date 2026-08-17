export interface SeedSongEntry {
  title: string;
  originalKey: string;
}

export interface SeedBlockEntry {
  number: number;
  songs: SeedSongEntry[];
}

export const rawBlocks: SeedBlockEntry[] = [
  {
    number: 1,
    songs: [{ title: 'Tô na Vibe', originalKey: 'A' }],
  },
  {
    number: 2,
    songs: [
      { title: 'Coração Partido', originalKey: 'Eb' },
      { title: 'Quem Vai Fazer o Arroz', originalKey: 'F' },
    ],
  },
  {
    number: 3,
    songs: [
      { title: 'Trem das Onzes', originalKey: 'Am' },
      { title: 'Do Jeito Que a Vida Quer', originalKey: 'Dm' },
      { title: 'Vivo Isolado do Mundo', originalKey: 'Dm' },
      { title: 'Vai Vadiar', originalKey: 'Dm' },
      { title: 'Maneiras', originalKey: 'Dm' },
    ],
  },
  {
    number: 4,
    songs: [
      { title: 'Mina de Fé', originalKey: 'Gm' },
      { title: 'Mais Que Nada', originalKey: 'Gm' },
      { title: 'Cilada', originalKey: 'Gm' },
      { title: 'Pimpolho', originalKey: 'Gm' },
      { title: 'Bombucado', originalKey: 'Gm' },
    ],
  },
  {
    number: 5,
    songs: [
      { title: 'Cheia de Manias', originalKey: 'Em' },
      { title: 'Velocidade da Luz', originalKey: 'Em' },
      { title: 'Temporal', originalKey: 'Em' },
      { title: 'Só Depois', originalKey: 'Em' },
    ],
  },
  {
    number: 6,
    songs: [
      { title: 'P do Pecado', originalKey: 'C' },
      { title: 'Pela Última Vez', originalKey: 'C' },
      { title: 'Última Noite', originalKey: 'C' },
      { title: 'Amar na Praia', originalKey: 'Dm' },
    ],
  },
  {
    number: 7,
    songs: [
      { title: 'Só Vai de Camarote', originalKey: 'Dm' },
      { title: 'Deixa em Off', originalKey: 'D' },
    ],
  },
  {
    number: 8,
    songs: [
      { title: 'Última Saudade', originalKey: 'D' },
      { title: 'A Maior Saudade', originalKey: 'A' },
      { title: 'Arranhão', originalKey: 'Bbm' },
    ],
  },
  {
    number: 9,
    songs: [
      { title: 'Melhor Eu Ir', originalKey: 'A' },
      { title: 'Ligando os Fatos', originalKey: 'A' },
      { title: 'Sonho de Amor', originalKey: 'A' },
      { title: 'Deixa Eu Te Querer', originalKey: 'A' },
    ],
  },
  {
    number: 10,
    songs: [
      { title: 'Inarí', originalKey: 'F' },
      { title: 'Já É', originalKey: 'D' },
      { title: 'Domingo', originalKey: 'G' },
      { title: 'Conselho', originalKey: 'G' },
    ],
  },
  {
    number: 11,
    songs: [
      { title: 'Marrom Bombom', originalKey: 'G' },
      { title: 'Que Se Chama Amor', originalKey: 'G' },
      { title: 'Não Foi Atoa', originalKey: 'G' },
      { title: 'Tarde Demais', originalKey: 'E' },
    ],
  },
  {
    number: 12,
    songs: [{ title: 'O Bem', originalKey: 'Gm' }],
  },
  {
    number: 13,
    songs: [
      { title: 'Coração Radiante', originalKey: 'C' },
      { title: 'Compasso do Amor', originalKey: 'C' },
      { title: 'Preciso Te Amar', originalKey: 'C' },
    ],
  },
  {
    number: 14,
    songs: [
      { title: 'Evidências', originalKey: 'A' },
      { title: 'Página de Amigos', originalKey: 'A' },
      { title: 'Convite de Casamento', originalKey: 'A' },
      { title: 'Dormi na Praça', originalKey: 'A' },
    ],
  },
  {
    number: 15,
    songs: [
      { title: 'Bebe e Vem Me Procurar', originalKey: 'Fm' },
      { title: 'Lance Livre', originalKey: 'Em' },
      { title: 'Vai Me Dando Corda', originalKey: 'Bb' },
      { title: 'Sou Favela', originalKey: 'Fm' },
      { title: 'Só Fé', originalKey: 'Eb' },
      { title: 'Melzinho', originalKey: 'Em' },
    ],
  },
  {
    number: 16,
    songs: [
      { title: 'Derê', originalKey: 'C' },
      { title: 'Pela Vida Inteira', originalKey: 'C' },
      { title: 'Morango do Nordeste', originalKey: 'A' },
    ],
  },
  {
    number: 17,
    songs: [
      { title: 'Deixa Alagar', originalKey: 'Gm' },
      { title: 'Hipnotiza', originalKey: 'Em' },
    ],
  },
  {
    number: 18,
    songs: [
      { title: 'Pé na Areia', originalKey: 'D' },
      { title: 'Interessante', originalKey: 'C' },
      { title: 'Arrependidaço', originalKey: 'Am' },
    ],
  },
  {
    number: 19,
    songs: [
      { title: 'Infância', originalKey: 'C' },
      { title: 'Amor dos Deuses', originalKey: 'C' },
      { title: 'Água de Chuva no Mar', originalKey: 'C' },
      { title: 'A Amizade', originalKey: 'C' },
    ],
  },
  {
    number: 20,
    songs: [
      { title: 'Lapada Dela', originalKey: 'Em' },
      { title: 'Curtindo a Vida', originalKey: 'Em' },
    ],
  },
  {
    number: 21,
    songs: [
      { title: 'Deixa Acontecer', originalKey: 'C' },
      { title: 'Problema Emocional', originalKey: 'D' },
      { title: 'Brilho no Olhar', originalKey: 'D' },
      { title: 'Não Deixe o Samba Morrer', originalKey: 'Gm' },
    ],
  },
  {
    number: 22,
    songs: [
      { title: 'Brincadeira Tem Hora', originalKey: 'F' },
      { title: 'Bagaço da Laranja', originalKey: 'F' },
      { title: 'Estrela da Paz', originalKey: 'F' },
    ],
  },
  {
    number: 23,
    songs: [
      { title: 'Tempo de Aprender', originalKey: 'D' },
      { title: 'Me Apaixonei pela Pessoa Errada', originalKey: 'D' },
      { title: 'Até Que Durou', originalKey: 'C' },
    ],
  },
  {
    number: 24,
    songs: [
      { title: 'Falta Você', originalKey: 'D' },
      { title: 'Separação', originalKey: 'C' },
      { title: 'Fatalmente', originalKey: 'C' },
      { title: 'Final de Tarde', originalKey: 'C' },
      { title: 'Reinventar', originalKey: 'C' },
    ],
  },
  {
    number: 25,
    songs: [
      { title: 'Trilha do Amor', originalKey: 'D' },
      { title: 'Flor de Liz', originalKey: 'C' },
    ],
  },
  {
    number: 26,
    songs: [
      { title: 'Mega Star', originalKey: 'E' },
      { title: 'Telegrama', originalKey: 'E' },
    ],
  },
  {
    number: 27,
    songs: [
      { title: 'Volta de Vez pra Mim', originalKey: 'C' },
      { title: 'Retrato Cantado de um Amor', originalKey: 'Dm' },
      { title: 'Amor Estou Sofrendo', originalKey: 'Dm' },
    ],
  },
  {
    number: 28,
    songs: [
      { title: 'Nem de Graça', originalKey: 'Bb' },
      { title: 'Insegurança', originalKey: 'Bb' },
      { title: 'Tu Mandas no Meu Coração', originalKey: 'G' },
    ],
  },
  {
    number: 29,
    songs: [{ title: 'Show Tem Que Continuar', originalKey: 'C' }],
  },
  {
    number: 30,
    songs: [{ title: 'Tô na Vibe', originalKey: 'A' }],
  },
  {
    number: 31,
    songs: [
      { title: 'Valeu', originalKey: 'C' },
      { title: 'Jogo de Sedução', originalKey: 'C' },
      { title: 'Mereço Ser Feliz', originalKey: 'C' },
    ],
  },
  {
    number: 32,
    songs: [
      { title: 'Fulminante', originalKey: 'C' },
      { title: 'Arrependidaço', originalKey: 'Am' },
      { title: 'Não Sou', originalKey: 'Am' },
    ],
  },
  {
    number: 33,
    songs: [
      { title: 'Quebrou a Cara', originalKey: 'E' },
      { title: 'Lepo Lepo', originalKey: 'A' },
      { title: 'Cavalinho', originalKey: 'Db' },
      { title: 'Friboi', originalKey: 'Dm' },
    ],
  },
  {
    number: 34,
    songs: [
      { title: 'Reboleixon', originalKey: 'F' },
      { title: 'Ziriguidum', originalKey: 'D#m' },
      { title: 'Devagarinho', originalKey: 'Fm' },
      { title: 'Várias Novinhas', originalKey: 'C#m' },
      { title: 'Posturado e Calmo', originalKey: 'C#m' },
      { title: 'Segura o Tchan', originalKey: 'F' },
      { title: 'Desafio', originalKey: 'F' },
    ],
  },
];
