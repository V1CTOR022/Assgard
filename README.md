# Assgard

Aplicativo de finanças pessoais para Android e iOS, feito em React Native com Expo.

O Assgard reúne suas contas em um só lugar, mostra o saldo somado em tempo real, registra entradas e saídas, avisa quando uma conta está perto de vencer e resume seus hábitos em um gráfico simples. Tudo fica salvo no próprio aparelho, sem servidor e sem cadastro obrigatório.

![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green)

## Sumário

- [Funcionalidades](#funcionalidades)
- [Como rodar](#como-rodar)
- [Dependências](#dependências)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Licença e uso livre](#licença-e-uso-livre)

## Funcionalidades

**Várias contas, um saldo só.** Conta principal, poupança e investimentos convivem no mesmo app. O saldo total aparece somado, e você alterna entre as contas sem sair da tela inicial.

**Conversão em dólar.** O saldo também é mostrado em dólar, com a cotação buscada na hora. Se a internet falhar, o app continua funcionando normalmente.

**Entradas, saídas e transferências.** Cada lançamento guarda nome, valor, conta e data, e entra direto no histórico.

**Histórico com busca.** Procure por nome ou valor, com os totais de entradas e saídas sempre à vista.

**Pendências com alarme.** Cadastre o que vence todo mês e receba uma notificação no dia. Contas atrasadas aparecem destacadas em vermelho.

**Dashboard.** Gráfico de barras com a movimentação por dia, para entender para onde o dinheiro está indo.

**Perfil.** Nome e foto editáveis, com o patrimônio total somado de todas as contas.

**Saldo oculto.** Um toque esconde todos os valores, para quando tiver alguém olhando a tela.

Toda a informação é gravada localmente com AsyncStorage. O app não envia seus dados financeiros para lugar nenhum.

## Como rodar

### O que você precisa antes

| Ferramenta | Versão | Observação |
|---|---|---|
| Node.js | 20 ou maior | O Expo SDK 54 não roda em versões anteriores |
| npm | 10 ou maior | Já vem junto com o Node |
| JDK | 17 | Só para Android. O Android Studio instala um junto |
| Android Studio | Qualquer recente | Para o emulador e o SDK do Android |
| Xcode | 15 ou maior | Só para iOS, e só funciona no macOS |

Você não precisa de conta no Expo nem de nenhuma chave de API para rodar o projeto.

### Passo a passo

**1. Baixe o projeto**

```bash
git clone https://github.com/V1CTOR022/Assgard.git
```

```bash
cd Assgard
```

**2. Instale as dependências**

```bash
npm install
```

**3. Prepare um aparelho**

Abra o Android Studio, vá em Device Manager e inicie um emulador. Ou conecte um celular Android por cabo com a depuração USB ativada.

Para conferir se o aparelho foi reconhecido:

```bash
adb devices
```

**4. Compile e instale o app**

```bash
npx expo run:android
```

No macOS, para iOS:

```bash
npx expo run:ios
```

A primeira execução demora, porque o Gradle compila o projeto nativo inteiro. Nas próximas, o app já estará instalado e você só precisa subir o servidor:

```bash
npx expo start
```

### Se algo der errado

**A tela fica branca e nada carrega.** Quase sempre é o servidor do Metro travado ou servindo de outra pasta. Derrube o processo que estiver na porta 8081 e suba de novo limpando o cache:

```bash
npx expo start --clear
```

**O app não acha o servidor.** Em emulador Android, redirecione a porta:

```bash
adb reverse tcp:8081 tcp:8081
```

**Erro de módulo nativo não encontrado** depois de instalar uma dependência nova. Dependências com código nativo exigem recompilar, não basta reiniciar o Metro. Rode `npx expo run:android` de novo.

### Sobre o Expo Go

O projeto foi testado compilando com `npx expo run:android`, que é o caminho recomendado aqui. O Expo Go até abre o app, mas as notificações das pendências dependem de agendamento nativo e não funcionam de forma confiável por lá.

## Dependências

### Base

| Pacote | Para que serve |
|---|---|
| `expo` | Plataforma e ferramentas de build |
| `react-native` | Framework do app |
| `react` | Biblioteca de interface |
| `typescript` | Tipagem estática, em modo estrito |

### Navegação

| Pacote | Para que serve |
|---|---|
| `@react-navigation/native` | Núcleo da navegação |
| `@react-navigation/native-stack` | Pilha de telas nativa |
| `@react-navigation/bottom-tabs` | Abas inferiores, com barra customizada |
| `react-native-screens` | Telas nativas, para a navegação ficar fluida |
| `react-native-safe-area-context` | Respeita notch e barra de gestos |

### Animação e gestos

| Pacote | Para que serve |
|---|---|
| `react-native-reanimated` | Animações rodando na thread de UI |
| `react-native-worklets` | Executa as funções de animação fora da thread de JS |
| `react-native-gesture-handler` | Arrastar e tocar com resposta nativa |

### Interface

| Pacote | Para que serve |
|---|---|
| `@expo/vector-icons` | Conjuntos de ícones |
| `expo-linear-gradient` | Degradês dos cartões e cabeçalhos |
| `react-native-svg` | Formas vetoriais, como o logo do Google |
| `expo-status-bar` | Controle da barra de status |

### Recursos do aparelho

| Pacote | Para que serve |
|---|---|
| `@react-native-async-storage/async-storage` | Guarda contas, lançamentos e pendências no aparelho |
| `expo-notifications` | Alarme das contas a vencer |
| `expo-image-picker` | Escolher a foto de perfil |
| `expo-file-system` | Guardar a foto escolhida |

## Estrutura do projeto

```
src/
├── assets/          imagens e logo
├── components/      componentes reaproveitados entre telas
├── context/         estado global de contas e pendências
├── hooks/           lógica reaproveitável
├── pages/           uma pasta por tela
├── services/        acesso a armazenamento, notificações e câmera
├── theme/           cores e estilos compartilhados
└── utils/           formatação de valores e datas
```

As telas nunca falam direto com módulos nativos. Tudo passa por `services/`, o que mantém a interface separada da plataforma e facilita portar o app depois.

## Licença e uso livre

Este projeto é **open source** sob a licença [MIT](LICENSE).

Na prática, isso quer dizer que **você pode usar tudo daqui livremente**:

- copiar o código, inteiro ou em pedaços
- modificar o que quiser
- usar em projetos pessoais, acadêmicos ou comerciais
- distribuir, publicar em loja e até vender

Não precisa pedir autorização e não precisa pagar nada. A única condição é manter o aviso de copyright e o texto da licença junto das partes que você reaproveitar. Se o projeto te ajudou, um crédito é bem-vindo, mas não é obrigatório.

O software é fornecido como está, sem garantias. Ele guarda dados financeiros apenas no aparelho e nunca passou por auditoria de segurança, então use por sua conta e risco.

## Autor

Feito por [Victor Vargas](https://github.com/V1CTOR022).
