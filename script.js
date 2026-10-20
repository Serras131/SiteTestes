(() => {
    // 1. BANCOS DE 50 PERGUNTAS REAIS E ÚNICAS PARA CADA TEMA
    const baseBanks = {
        webdev: [
            { id: 1, text: "O que significa HTML?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text", "Hyper Tool Language"], correct: 0 },
            { id: 2, text: "Qual a tag HTML correta para o título com maior destaque?", options: ["<heading>", "<h6>", "<head>", "<h1>"], correct: 3 },
            { id: 3, text: "Qual a tag HTML usada para criar um link (hiperligação)?", options: ["<a>", "<link>", "<href>", "<nav>"], correct: 0 },
            { id: 4, text: "Que atributo especifica o URL de destino num link?", options: ["src", "link", "href", "url"], correct: 2 },
            { id: 5, text: "Qual a tag correta para inserir uma imagem?", options: ["<image>", "<img>", "<pic>", "<src>"], correct: 1 },
            { id: 6, text: "Qual atributo é obrigatório na tag <img> para texto alternativo?", options: ["title", "desc", "alt", "text"], correct: 2 },
            { id: 7, text: "Como se cria uma lista numerada em HTML?", options: ["<ul>", "<list>", "<nl>", "<ol>"], correct: 3 },
            { id: 8, text: "Como se cria uma lista não ordenada (com marcadores)?", options: ["<ul>", "<list>", "<ol>", "<dl>"], correct: 0 },
            { id: 9, text: "Qual a tag para inserir uma quebra de linha?", options: ["<break>", "<lb>", "<br>", "<newline>"], correct: 2 },
            { id: 10, text: "Qual o doctype correto para HTML5?", options: ["<!DOCTYPE html5>", "<!DOCTYPE HTML>", "<!DOCTYPE html>", "<doctype html>"], correct: 2 },
            { id: 11, text: "Qual a tag HTML para criar uma tabela?", options: ["<tbl>", "<table>", "<tt>", "<tab>"], correct: 1 },
            { id: 12, text: "Dentro de uma tabela, qual a tag para criar uma linha?", options: ["<td>", "<tr>", "<th>", "<line>"], correct: 1 },
            { id: 13, text: "Qual a tag HTML semântica para o rodapé de uma página?", options: ["<bottom>", "<footer>", "<end>", "<section>"], correct: 1 },
            { id: 14, text: "Qual tag é usada para criar um campo de texto num formulário?", options: ["<input type='text'>", "<textfield>", "<textinput>", "<input text>"], correct: 0 },
            { id: 15, text: "Qual tag define uma lista suspensa (dropdown)?", options: ["<list>", "<dropdown>", "<select>", "<menu>"], correct: 2 },
            { id: 16, text: "Onde deve ser colocada a tag <title> num documento HTML?", options: ["No <body>", "No <head>", "No final", "Antes do DOCTYPE"], correct: 1 },
            { id: 17, text: "Qual tag representa o conteúdo principal (main) de um documento?", options: ["<content>", "<main>", "<body>", "<primary>"], correct: 1 },
            { id: 18, text: "O que significa CSS?", options: ["Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], correct: 0 },
            { id: 19, text: "Qual tag HTML inclui uma folha de estilos interna?", options: ["<style>", "<css>", "<script>", "<link>"], correct: 0 },
            { id: 20, text: "Qual atributo HTML é usado para estilos inline?", options: ["class", "styles", "style", "font"], correct: 2 },
            { id: 21, text: "Qual propriedade CSS controla a cor do texto?", options: ["text-color", "fgcolor", "color", "font-color"], correct: 2 },
            { id: 22, text: "Qual propriedade CSS altera a cor de fundo?", options: ["bgcolor", "color", "background-color", "background-image"], correct: 2 },
            { id: 23, text: "Como selecionar um elemento com o id 'topo' em CSS?", options: ["*topo", ".topo", "topo", "#topo"], correct: 3 },
            { id: 24, text: "Como selecionar elementos com a classe 'caixa' em CSS?", options: [".caixa", "#caixa", "caixa", "*caixa"], correct: 0 },
            { id: 25, text: "Qual propriedade altera o tamanho da fonte?", options: ["text-style", "font-size", "text-size", "font-weight"], correct: 1 },
            { id: 26, text: "Como remover o sublinhado de um link em CSS?", options: ["text-decoration: no-underline;", "text-decoration: none;", "font-style: normal;", "text-style: none;"], correct: 1 },
            { id: 27, text: "Qual propriedade coloca o texto em negrito?", options: ["font-weight: bold;", "style: bold;", "font: bold;", "text-weight: bold;"], correct: 0 },
            { id: 28, text: "O que faz a propriedade 'display: none;'?", options: ["Esconde o elemento mas ocupa espaço", "Esconde o elemento e remove o seu espaço", "Torna o elemento transparente", "Desativa o elemento"], correct: 1 },
            { id: 29, text: "Qual propriedade altera a fonte de um elemento?", options: ["font-family", "font-style", "font-weight", "text-font"], correct: 0 },
            { id: 30, text: "No Box Model, o que é o 'padding'?", options: ["Espaço exterior à borda", "A borda em si", "Espaço entre conteúdo e borda", "O tamanho do conteúdo"], correct: 2 },
            { id: 31, text: "No Box Model, o que é a 'margin'?", options: ["Espaço interior", "Espaço exterior à borda", "Espessura da linha", "Alinhamento"], correct: 1 },
            { id: 32, text: "Como centrar um bloco horizontalmente com largura definida?", options: ["margin: 0 auto;", "text-align: center;", "align: center;", "padding: auto;"], correct: 0 },
            { id: 33, text: "Qual destas propriedades pertence ao Flexbox?", options: ["grid-template", "justify-content", "float", "position"], correct: 1 },
            { id: 34, text: "Como fazer uma imagem ocupar 100% da largura do contentor?", options: ["width: auto;", "width: 100%;", "size: 100%;", "max-width: full;"], correct: 1 },
            { id: 35, text: "Onde colocamos o código JavaScript num documento HTML?", options: ["<js>", "<scripting>", "<script>", "<javascript>"], correct: 2 },
            { id: 36, text: "Como escrever 'Olá Mundo' numa caixa de alerta?", options: ["msgBox('Olá Mundo');", "alertBox('Olá Mundo');", "msg('Olá Mundo');", "alert('Olá Mundo');"], correct: 3 },
            { id: 37, text: "Como se cria uma função em JavaScript?", options: ["function:minhaFuncao()", "function minhaFuncao()", "create minhaFuncao()", "def minhaFuncao()"], correct: 1 },
            { id: 38, text: "Como se executa uma função chamada 'minhaFuncao'?", options: ["call minhaFuncao", "minhaFuncao()", "call function minhaFuncao()", "execute minhaFuncao()"], correct: 1 },
            { id: 39, text: "Como escrever um comentário de uma linha em JS?", options: ["<!-- comentário -->", "' comentário", "// comentário", "/* comentário */"], correct: 2 },
            { id: 40, text: "Como declarar uma variável constante (que não pode ser reatribuída)?", options: ["var", "let", "const", "static"], correct: 2 },
            { id: 41, text: "Qual operador verifica igualdade estrita (valor e tipo)?", options: ["=", "==", "===", "!="], correct: 2 },
            { id: 42, text: "Qual destas estruturas de ciclo (loop) é válida em JS?", options: ["loop i=1 to 5", "for (let i=0; i<5; i++)", "repeat (5)", "while (i=0 to 5)"], correct: 1 },
            { id: 43, text: "O que retorna a expressão 'typeof 5'?", options: ["number", "string", "NaN", "undefined"], correct: 0 },
            { id: 44, text: "Como adicionar um elemento ao final de um array em JS?", options: ["array.push()", "array.add()", "array.insert()", "array.append()"], correct: 0 },
            { id: 45, text: "Qual método converte um objeto JS em string JSON?", options: ["JSON.parse()", "JSON.stringify()", "JSON.toString()", "JSON.objectify()"], correct: 1 },
            { id: 46, text: "O que significa a sigla DOM?", options: ["Data Object Model", "Document Object Model", "Display Object Management", "Document Orientation Model"], correct: 1 },
            { id: 47, text: "Como selecionar um elemento pelo ID usando JS moderno?", options: ["document.querySelector('#id')", "document.getElementById('id')", "Ambas estão corretas", "Nenhuma está correta"], correct: 2 },
            { id: 48, text: "O que faz a instrução 'console.log()'?", options: ["Mostra alerta no ecrã", "Imprime mensagens na consola do navegador", "Fecha a janela", "Pára a execução"], correct: 1 },
            { id: 49, text: "Qual evento ocorre quando o utilizador clica num elemento?", options: ["onmouseclick", "onchange", "onclick", "onhover"], correct: 2 },
            { id: 50, text: "O que representa o valor 'NaN' em JavaScript?", options: ["Not a Null", "Not a Number", "New array Notation", "No action Needed"], correct: 1 }
        ],
        sql: [
            { id: 1, text: "O que significa SQL?", options: ["Structured Query Language", "Strong Question Language", "Structured Question Language", "Simple Query Language"], correct: 0 },
            { id: 2, text: "Qual comando é usado para extrair dados?", options: ["EXTRACT", "SELECT", "GET", "OPEN"], correct: 1 },
            { id: 3, text: "Qual comando atualiza dados?", options: ["SAVE", "UPDATE", "MODIFY", "CHANGE"], correct: 1 },
            { id: 4, text: "Qual comando insere novos dados?", options: ["ADD RECORD", "INSERT INTO", "NEW INTO", "APPEND"], correct: 1 },
            { id: 5, text: "Qual comando elimina dados de uma tabela?", options: ["REMOVE", "DELETE FROM", "DROP", "CLEAR"], correct: 1 },
            { id: 6, text: "Qual cláusula filtra os resultados?", options: ["FILTER", "WHERE", "HAVING", "LIMIT"], correct: 1 },
            { id: 7, text: "Qual cláusula ordena os resultados?", options: ["ORDER BY", "SORT BY", "GROUP BY", "ARRANGE BY"], correct: 0 },
            { id: 8, text: "Qual comando cria uma nova tabela?", options: ["NEW TABLE", "CREATE TABLE", "MAKE TABLE", "BUILD TABLE"], correct: 1 },
            { id: 9, text: "Qual comando apaga uma tabela e sua estrutura?", options: ["DELETE TABLE", "DROP TABLE", "REMOVE TABLE", "TRUNCATE TABLE"], correct: 1 },
            { id: 10, text: "Qual comando apenas limpa os dados da tabela, mantendo a estrutura?", options: ["DROP", "DELETE", "TRUNCATE", "CLEAR"], correct: 2 },
            { id: 11, text: "Qual operador busca um padrão específico?", options: ["LIKE", "SEARCH", "MATCH", "FIND"], correct: 0 },
            { id: 12, text: "Como selecionar todos os campos de uma tabela chamada 'users'?", options: ["SELECT all FROM users", "SELECT * FROM users", "SELECT users", "GET * FROM users"], correct: 1 },
            { id: 13, text: "Qual palavra-chave retorna apenas valores distintos?", options: ["UNIQUE", "DISTINCT", "DIFFERENT", "SINGLE"], correct: 1 },
            { id: 14, text: "Qual função retorna o número de linhas?", options: ["TOTAL()", "COUNT()", "SUM()", "NUMBER()"], correct: 1 },
            { id: 15, text: "Qual função retorna a soma de uma coluna numérica?", options: ["TOTAL()", "COUNT()", "SUM()", "ADD()"], correct: 2 },
            { id: 16, text: "Qual função retorna a média de uma coluna?", options: ["AVG()", "MEAN()", "AVERAGE()", "MEDIAN()"], correct: 0 },
            { id: 17, text: "Qual função retorna o valor máximo de uma coluna?", options: ["HIGH()", "MAX()", "TOP()", "PEAK()"], correct: 1 },
            { id: 18, text: "Qual função retorna o valor mínimo de uma coluna?", options: ["LOW()", "MIN()", "BOTTOM()", "BASE()"], correct: 1 },
            { id: 19, text: "Qual cláusula agrupa resultados com funções de agregação?", options: ["GROUP BY", "CLUSTER BY", "COLLECT BY", "JOIN BY"], correct: 0 },
            { id: 20, text: "Qual cláusula filtra resultados após um GROUP BY?", options: ["WHERE", "FILTER", "HAVING", "CHECK"], correct: 2 },
            { id: 21, text: "Como selecionar registos onde o nome começa por 'A'?", options: ["WHERE nome LIKE 'A%'", "WHERE nome = 'A*'", "WHERE nome START 'A'", "WHERE nome LIKE '%A'"], correct: 0 },
            { id: 22, text: "Como selecionar registos onde o nome termina em 'a'?", options: ["WHERE nome LIKE 'a%'", "WHERE nome = '*a'", "WHERE nome END 'a'", "WHERE nome LIKE '%a'"], correct: 3 },
            { id: 23, text: "Qual operador seleciona valores dentro de um intervalo?", options: ["BETWEEN", "WITHIN", "RANGE", "IN"], correct: 0 },
            { id: 24, text: "Qual operador verifica se um valor corresponde a qualquer valor numa lista?", options: ["ANY", "IN", "CONTAINS", "MATCH"], correct: 1 },
            { id: 25, text: "Que tipo de JOIN retorna apenas os registos com correspondência em ambas as tabelas?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], correct: 0 },
            { id: 26, text: "Que tipo de JOIN retorna todos os registos da tabela à esquerda, mesmo sem correspondência na da direita?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], correct: 1 },
            { id: 27, text: "Que tipo de JOIN retorna todos os registos de ambas as tabelas?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correct: 3 },
            { id: 28, text: "Qual comando adiciona uma coluna a uma tabela existente?", options: ["ALTER TABLE ... ADD", "MODIFY TABLE ... ADD", "UPDATE TABLE ... ADD", "CHANGE TABLE ... ADD"], correct: 0 },
            { id: 29, text: "Qual comando remove uma coluna de uma tabela?", options: ["ALTER TABLE ... DROP", "ALTER TABLE ... REMOVE", "ALTER TABLE ... DELETE", "DROP COLUMN"], correct: 0 },
            { id: 30, text: "Qual restrição garante que não há valores nulos numa coluna?", options: ["NOT NULL", "UNIQUE", "CHECK", "DEFAULT"], correct: 0 },
            { id: 31, text: "Qual restrição garante valores únicos, mas permite nulos?", options: ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "INDEX"], correct: 2 },
            { id: 32, text: "Qual restrição identifica unicamente um registo (não permite nulos e deve ser única)?", options: ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE", "INDEX"], correct: 0 },
            { id: 33, text: "O que é uma Foreign Key (Chave Estrangeira)?", options: ["Chave de encriptação", "Coluna que referencia uma Primary Key noutra tabela", "Chave aleatória", "Chave primária secundária"], correct: 1 },
            { id: 34, text: "Qual restrição assegura que todos os valores numa coluna satisfazem uma condição?", options: ["CHECK", "CONDITION", "RULE", "VERIFY"], correct: 0 },
            { id: 35, text: "Qual restrição define um valor padrão caso nenhum seja inserido?", options: ["DEFAULT", "STANDARD", "BASIC", "INITIAL"], correct: 0 },
            { id: 36, text: "Como criar um índice numa tabela?", options: ["CREATE INDEX", "MAKE INDEX", "ADD INDEX", "NEW INDEX"], correct: 0 },
            { id: 37, text: "Qual a principal utilidade de um INDEX?", options: ["Acelerar as consultas de leitura", "Proteger a tabela", "Comprimir os dados", "Impedir inserções nulas"], correct: 0 },
            { id: 38, text: "Como ordenar resultados de forma decrescente?", options: ["ORDER BY coluna DESC", "ORDER BY coluna ASC", "ORDER BY coluna DOWN", "SORT coluna DESC"], correct: 0 },
            { id: 39, text: "Como ordenar resultados de forma crescente (padrão)?", options: ["ORDER BY coluna DESC", "ORDER BY coluna ASC", "ORDER BY coluna UP", "SORT coluna ASC"], correct: 1 },
            { id: 40, text: "Qual operador é usado para o 'NÃO IGUAL' no SQL padrão?", options: ["!=", "<>", "Ambas as opções", "Nenhuma"], correct: 2 },
            { id: 41, text: "Qual comando guarda as alterações permanentemente numa transação?", options: ["SAVE", "COMMIT", "PUSH", "WRITE"], correct: 1 },
            { id: 42, text: "Qual comando reverte as alterações numa transação?", options: ["UNDO", "REVERT", "ROLLBACK", "CANCEL"], correct: 2 },
            { id: 43, text: "Qual instrução cria uma View (tabela virtual baseada numa consulta)?", options: ["CREATE VIEW", "MAKE VIEW", "NEW VIEW", "BUILD VIEW"], correct: 0 },
            { id: 44, text: "O que é um Stored Procedure?", options: ["Um erro de sistema", "Um bloco de código SQL guardado na base de dados para reutilização", "Uma tabela temporária", "Um trigger"], correct: 1 },
            { id: 45, text: "O que é um Trigger?", options: ["Um botão de interface", "Um tipo de join", "Um comando que executa automaticamente em resposta a um evento na tabela", "Uma view"], correct: 2 },
            { id: 46, text: "Como se chama uma relação onde um registo da Tabela A pode ter vários correspondentes na Tabela B, e vice-versa?", options: ["1 para 1", "1 para N", "N para M (Muitos para Muitos)", "Nenhuma das anteriores"], correct: 2 },
            { id: 47, text: "Como resolvemos uma relação Muitos para Muitos (N:M) no modelo relacional?", options: ["Com uma tabela associativa (tabela de ligação)", "Ignorando a relação", "Juntando tudo numa tabela", "Apagando uma tabela"], correct: 0 },
            { id: 48, text: "No SQL, o que significa a sigla DML?", options: ["Data Manipulation Language", "Data Model Language", "Database Management Language", "Database Manipulation Logic"], correct: 0 },
            { id: 49, text: "No SQL, o que significa a sigla DDL?", options: ["Data Definition Language", "Data Database Logic", "Data Document Language", "Database Definition Logic"], correct: 0 },
            { id: 50, text: "Qual destes comandos pertence ao DML?", options: ["CREATE", "ALTER", "INSERT", "DROP"], correct: 2 }
        ],
        networks: [
            { id: 1, text: "O que significa a sigla LAN?", options: ["Local Area Network", "Large Area Network", "Logical Area Network", "Local Access Node"], correct: 0 },
            { id: 2, text: "Qual a camada 1 do Modelo OSI?", options: ["Camada Física", "Camada de Enlace", "Camada de Rede", "Camada de Transporte"], correct: 0 },
            { id: 3, text: "Qual a camada 2 do Modelo OSI?", options: ["Camada de Rede", "Camada de Sessão", "Camada de Enlace", "Camada de Aplicação"], correct: 2 },
            { id: 4, text: "Qual a camada 3 do Modelo OSI?", options: ["Camada de Rede", "Camada de Transporte", "Camada de Apresentação", "Camada de Física"], correct: 0 },
            { id: 5, text: "Qual a camada do Modelo OSI responsável pelo roteamento (encaminhamento)?", options: ["Física", "Enlace", "Rede", "Transporte"], correct: 2 },
            { id: 6, text: "Qual a camada 4 do Modelo OSI?", options: ["Camada de Enlace", "Camada de Sessão", "Camada de Transporte", "Camada de Rede"], correct: 2 },
            { id: 7, text: "Qual a camada 7 do Modelo OSI?", options: ["Camada de Transporte", "Camada de Aplicação", "Camada de Apresentação", "Camada Física"], correct: 1 },
            { id: 8, text: "Qual endereço IP é conhecido como localhost (loopback) no IPv4?", options: ["192.168.1.1", "10.0.0.1", "127.0.0.1", "255.255.255.0"], correct: 2 },
            { id: 9, text: "O que faz o protocolo DNS?", options: ["Traduz IPs para endereços MAC", "Traduz nomes de domínio para endereços IP", "Atribui IPs automaticamente", "Cifra a comunicação web"], correct: 1 },
            { id: 10, text: "O que faz o protocolo DHCP?", options: ["Distribui endereços IP dinamicamente", "Mapeia MAC para IP", "Transfere ficheiros", "Gere o email"], correct: 0 },
            { id: 11, text: "Quantos bits tem um endereço IPv4?", options: ["16", "32", "64", "128"], correct: 1 },
            { id: 12, text: "Quantos bits tem um endereço IPv6?", options: ["32", "64", "128", "256"], correct: 2 },
            { id: 13, text: "Como é representado um endereço IPv6?", options: ["Em notação decimal com pontos", "Em notação hexadecimal separada por dois pontos (:)", "Em binário puro", "Em números romanos"], correct: 1 },
            { id: 14, text: "Qual equipamento atua principalmente na Camada 2 (Enlace)?", options: ["Hub", "Router", "Switch", "Gateway"], correct: 2 },
            { id: 15, text: "Qual equipamento atua principalmente na Camada 3 (Rede)?", options: ["Hub", "Switch Nível 2", "Repetidor", "Router"], correct: 3 },
            { id: 16, text: "O que é o endereço MAC?", options: ["Um endereço lógico da internet", "Um endereço físico único da placa de rede", "O endereço do servidor DNS", "Uma porta de comunicação"], correct: 1 },
            { id: 17, text: "Quantos bits tem um endereço MAC?", options: ["32", "48", "64", "128"], correct: 1 },
            { id: 18, text: "Qual protocolo resolve um IP para descobrir o respetivo MAC address na rede local?", options: ["DNS", "DHCP", "ARP", "ICMP"], correct: 2 },
            { id: 19, text: "Qual protocolo é usado pelo comando 'ping' para testar a conectividade?", options: ["TCP", "UDP", "ARP", "ICMP"], correct: 3 },
            { id: 20, text: "O TCP e o UDP pertencem a que camada do Modelo OSI?", options: ["Aplicação", "Transporte", "Rede", "Enlace"], correct: 1 },
            { id: 21, text: "Qual a diferença entre TCP e UDP?", options: ["O TCP é rápido e não fiável; UDP é fiável", "O TCP garante entrega e ordenação; UDP não garante entrega mas é mais rápido", "Ambos garantem entrega", "O UDP é para web e o TCP para vídeo"], correct: 1 },
            { id: 22, text: "Qual é a porta padrão para o protocolo HTTP?", options: ["21", "25", "80", "443"], correct: 2 },
            { id: 23, text: "Qual é a porta padrão para o protocolo HTTPS (seguro)?", options: ["21", "80", "443", "8080"], correct: 2 },
            { id: 24, text: "Qual é a porta padrão para o FTP (transferência de dados)?", options: ["21", "22", "23", "25"], correct: 0 },
            { id: 25, text: "O protocolo SSH utiliza que porta por defeito?", options: ["21", "22", "23", "3389"], correct: 1 },
            { id: 26, text: "Qual é a topologia de rede onde todos os nós estão ligados a um dispositivo central?", options: ["Anel", "Malha", "Estrela", "Barramento"], correct: 2 },
            { id: 27, text: "O que significa WLAN?", options: ["Wide Local Area Network", "Wireless Local Area Network", "Wired Local Area Network", "Web Local Area Network"], correct: 1 },
            { id: 28, text: "O que é o NAT (Network Address Translation)?", options: ["Um antivírus", "A conversão de IPs privados em IP público para acesso à internet", "Uma tabela de rotas BGP", "Um cabo de rede especial"], correct: 1 },
            { id: 29, text: "Qual é a máscara de sub-rede padrão para uma rede Classe C?", options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"], correct: 2 },
            { id: 30, text: "Qual é o endereço de broadcast numa rede 192.168.1.0/24?", options: ["192.168.1.1", "192.168.1.254", "192.168.1.255", "192.168.255.255"], correct: 2 },
            { id: 31, text: "O que significa VPN?", options: ["Virtual Private Network", "Visual Private Network", "Virtual Public Network", "Valid Private Node"], correct: 0 },
            { id: 32, text: "Qual é a função do Gateway numa rede?", options: ["Fornecer energia aos switches", "Servir de porta de saída para outras redes (ex: Internet)", "Atribuir MAC addresses", "Acelerar a velocidade do Wi-Fi"], correct: 1 },
            { id: 33, text: "Qual cabo é mais imune a interferências eletromagnéticas?", options: ["Cabo Coaxial", "Cabo UTP", "Fibra Ótica", "Cabo STP"], correct: 2 },
            { id: 34, text: "No padrão T568A / T568B para cabos de par trançado, qual o conector usado?", options: ["RJ11", "BNC", "RJ45", "SFP"], correct: 2 },
            { id: 35, text: "O que define o CSMA/CD em redes Ethernet?", options: ["A encriptação do Wi-Fi", "Um mecanismo de deteção e tratamento de colisões em meios partilhados", "Um protocolo de email", "A velocidade do router"], correct: 1 },
            { id: 36, text: "O Wi-Fi utiliza qual mecanismo de acesso ao meio?", options: ["CSMA/CD", "CSMA/CA", "Token Ring", "FDDI"], correct: 1 },
            { id: 37, text: "Em que camada opera o protocolo IP?", options: ["Enlace", "Transporte", "Rede", "Sessão"], correct: 2 },
            { id: 38, text: "Qual gama de IPs é considerada privada (Classe B)?", options: ["10.0.0.0 a 10.255.255.255", "172.16.0.0 a 172.31.255.255", "192.168.0.0 a 192.168.255.255", "224.0.0.0 a 239.255.255.255"], correct: 1 },
            { id: 39, text: "O que é o TTL (Time To Live) num pacote IP?", options: ["O tamanho máximo do pacote", "O tempo em segundos que o pacote demora a chegar", "Um contador que diminui a cada salto (router) para evitar loops infinitos", "A prioridade do pacote"], correct: 2 },
            { id: 40, text: "Qual é o protocolo usado para enviar emails?", options: ["POP3", "IMAP", "SMTP", "SNMP"], correct: 2 },
            { id: 41, text: "Qual é o protocolo usado para receber emails mantendo-os no servidor?", options: ["SMTP", "POP3", "IMAP", "FTP"], correct: 2 },
            { id: 42, text: "Qual é o protocolo usado para gestão e monitorização de dispositivos de rede?", options: ["SMTP", "SNMP", "SIP", "NTP"], correct: 1 },
            { id: 43, text: "O que é um VLAN?", options: ["Uma rede local virtual que segmenta logicamente uma rede física", "Um cabo de rede muito longo", "Um antivírus de rede", "Um protocolo de routing dinâmico"], correct: 0 },
            { id: 44, text: "O que faz o protocolo OSPF?", options: ["Distribui IPs", "Gere o DNS", "É um protocolo de roteamento dinâmico baseado em estado de ligação (link-state)", "Envia emails"], correct: 2 },
            { id: 45, text: "O que é o BGP?", options: ["O protocolo de roteamento usado no núcleo da Internet entre ISPs", "Um cabo de fibra ótica", "Um switch de camada 2", "O protocolo de loopback"], correct: 0 },
            { id: 46, text: "Qual o papel de uma Firewall?", options: ["Acelerar a internet", "Monitorizar e controlar o tráfego de entrada e saída baseado em regras de segurança", "Fazer backups", "Criar sites"], correct: 1 },
            { id: 47, text: "O que é o modelo TCP/IP?", options: ["Um modelo de 7 camadas idêntico ao OSI", "Um modelo prático de 4 camadas (Enlace, Internet, Transporte, Aplicação)", "Um modelo obsoleto", "Apenas uma marca de router"], correct: 1 },
            { id: 48, text: "O que é um 'Default Route' (Rota Padrão)?", options: ["A rota para a rede local", "A rota usada quando não há correspondência específica na tabela de roteamento (ex: Internet)", "Uma rota falhada", "A rota do loopback"], correct: 1 },
            { id: 49, text: "Qual a velocidade máxima teórica do padrão Gigabit Ethernet?", options: ["10 Mbps", "100 Mbps", "1000 Mbps (1 Gbps)", "10 Gbps"], correct: 2 },
            { id: 50, text: "O que significa PoE?", options: ["Power over Ethernet (energia pelo cabo de rede)", "Point of Entry", "Protocol of Encryption", "Ping over Ethernet"], correct: 0 }
        ]
    };

    let activeQuestionsBank = [];

    function loadCustomThemesDropdown() {
        const group = document.getElementById('customThemesGroup');
        if(!group) return;
        group.innerHTML = '';
        let saved = JSON.parse(localStorage.getItem('qg_custom_banks')) || {};
        for(let name in saved) {
            let opt = document.createElement('option');
            opt.value = "custom_" + name;
            opt.textContent = `⭐ ${name} (${saved[name].length} q)`;
            group.appendChild(opt);
        }
    }
    loadCustomThemesDropdown();

    // 2. MQTT SETUP
    const brokerUrl = 'wss://test.mosquitto.org:8081';
    let client = mqtt.connect(brokerUrl);
    let roomCode = '', myId = '', isTeacher = false;
    let liveStudentsData = {}, submissionsData = [];
    
    let myTestQuestions = [], studentAnswers = [], myInfractions = [];
    let currentQIndex = 0, timeRemainingSeconds = 0, timerInterval = null;
    let currentState = 'A_AGUARDAR';
    let downloadedBank = null;

    client.on('connect', () => {
        const statusEl = document.getElementById('connStatus');
        if(statusEl) {
            statusEl.innerHTML = '<i class="fa-solid fa-check"></i> Ligado com sucesso.';
            statusEl.style.color = 'var(--success)';
        }
        const btnStart = document.getElementById('btnStartTest');
        if(btnStart) btnStart.disabled = false;
    });

    // SEGURANÇA
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if(e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))) {
            e.preventDefault(); triggerAntiCheat("Tentativa de Inspeção de Código");
        }
    });

    // NAVEGAÇÃO
    document.getElementById('btnStudentView').addEventListener('click', () => {
        isTeacher = false; document.getElementById('studentView').classList.remove('hidden'); document.getElementById('teacherView').classList.add('hidden');
    });
    document.getElementById('btnTeacherView').addEventListener('click', () => document.getElementById('teacherAuthModal').classList.remove('hidden'));
    document.getElementById('btnCancelAuth').addEventListener('click', () => document.getElementById('teacherAuthModal').classList.add('hidden'));

    document.getElementById('btnSubmitAuth').addEventListener('click', () => {
        const pass = document.getElementById('teacherPasswordInput').value;
        const code = document.getElementById('teacherRoomInput').value.trim();
        const themeKey = document.getElementById('teacherBankSelect').value;

        if(!code) return alert("Insira o código da sala!");
        if(pass === 'admin') {
            document.getElementById('teacherAuthModal').classList.add('hidden');
            document.getElementById('teacherView').classList.remove('hidden');
            document.getElementById('studentView').classList.add('hidden');
            isTeacher = true; roomCode = code;
            document.getElementById('displayRoomCode').textContent = roomCode;

            if(themeKey.startsWith("custom_")) {
                let saved = JSON.parse(localStorage.getItem('qg_custom_banks')) || {};
                activeQuestionsBank = saved[themeKey.replace("custom_", "")] || [];
            } else {
                activeQuestionsBank = JSON.parse(JSON.stringify(baseBanks[themeKey] || []));
            }

            client.publish(`quizguard/${roomCode}/questions`, JSON.stringify(activeQuestionsBank), {retain: true});
            client.subscribe(`quizguard/${roomCode}/std/+`);
            client.subscribe(`quizguard/${roomCode}/sub/+`);
        } else {
            document.getElementById('authError').classList.remove('hidden');
        }
    });

    // 3. GESTÃO E EDIÇÃO DE PERGUNTAS (PROFESSOR)
    document.getElementById('btnManageQuestions').addEventListener('click', () => {
        document.getElementById('qManagerModal').classList.remove('hidden');
        renderQuestionsTable();
    });
    document.getElementById('btnCloseQManager').addEventListener('click', () => {
        document.getElementById('qManagerModal').classList.add('hidden');
        client.publish(`quizguard/${roomCode}/questions`, JSON.stringify(activeQuestionsBank), {retain: true});
        alert("Alterações guardadas e sincronizadas com a sala!");
    });

    function renderQuestionsTable() {
        const tbody = document.getElementById('questionsTable').querySelector('tbody');
        tbody.innerHTML = '';
        activeQuestionsBank.forEach(q => {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${q.id}</td><td>${q.text}</td><td>
                <button class="btn warning btn-icon" onclick="window.editQ(${q.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn danger btn-icon" onclick="window.deleteQ(${q.id})"><i class="fa-solid fa-trash"></i></button>
            </td>`;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('btnSaveQuestion').addEventListener('click', () => {
        const id = document.getElementById('editQId').value;
        const txt = document.getElementById('editQText').value;
        const opts = [document.getElementById('editOpt0').value, document.getElementById('editOpt1').value, document.getElementById('editOpt2').value, document.getElementById('editOpt3').value];
        const correct = parseInt(document.getElementById('editQCorrect').value);

        if(!txt || opts.some(o => !o)) return alert("Preencha o texto e todas as 4 opções.");

        if(id) {
            let q = activeQuestionsBank.find(x => x.id == id);
            q.text = txt; q.options = opts; q.correct = correct;
        } else {
            let newId = activeQuestionsBank.length ? Math.max(...activeQuestionsBank.map(b=>b.id)) + 1 : 1;
            activeQuestionsBank.push({id: newId, text: txt, options: opts, correct: correct});
        }
        renderQuestionsTable();
        document.getElementById('editQId').value = '';
        document.querySelectorAll('#qManagerModal input[type="text"]').forEach(i => i.value = '');
    });

    document.getElementById('btnSaveCustomTheme').addEventListener('click', () => {
        let name = prompt("Nome para guardar este banco de perguntas:");
        if(!name) return;
        let saved = JSON.parse(localStorage.getItem('qg_custom_banks')) || {};
        saved[name] = activeQuestionsBank;
        localStorage.setItem('qg_custom_banks', JSON.stringify(saved));
        loadCustomThemesDropdown();
        alert("Tema guardado com sucesso!");
    });

    window.editQ = (id) => {
        let q = activeQuestionsBank.find(x => x.id == id);
        document.getElementById('editQId').value = q.id;
        document.getElementById('editQText').value = q.text;
        document.getElementById('editOpt0').value = q.options[0];
        document.getElementById('editOpt1').value = q.options[1];
        document.getElementById('editOpt2').value = q.options[2];
        document.getElementById('editOpt3').value = q.options[3];
        document.getElementById('editQCorrect').value = q.correct;
    };
    window.deleteQ = (id) => {
        activeQuestionsBank = activeQuestionsBank.filter(x => x.id != id);
        renderQuestionsTable();
    };

    // 4. MENSAGENS MQTT E COMANDOS
    client.on('message', (topic, payload) => {
        const msg = payload.toString();
        const parts = topic.split('/');

        if(parts[2] === 'questions' && !isTeacher) {
            downloadedBank = JSON.parse(msg);
        }

        if(parts[2] === 'cmd' && parts[3] === myId && !isTeacher) {
            let cmd = JSON.parse(msg);
            if(cmd.action === 'start_test') {
                currentState = 'EM_TESTE';
                document.getElementById('studentWaitModal').classList.add('hidden');
                document.getElementById('studentLockModal').classList.add('hidden');
                startTimer(); publishState();
                try { document.documentElement.requestFullscreen(); } catch(e){}
            } else if(cmd.action === 'unlock' || cmd.action === 'unlock_time') {
                if(cmd.action === 'unlock_time') timeRemainingSeconds -= cmd.amount;
                currentState = 'EM_TESTE';
                document.getElementById('studentLockModal').classList.add('hidden');
                publishState();
                try { document.documentElement.requestFullscreen(); } catch(e){}
            } else if(cmd.action === 'force_pause') {
                currentState = 'PAUSADO';
                document.getElementById('lockTitleText').textContent = "TESTE PAUSADO";
                document.getElementById('lockReasonText').textContent = "O professor congelou o seu ecrã para verificação.";
                document.getElementById('studentLockModal').classList.remove('hidden');
                publishState();
            } else if(cmd.action === 'kick') {
                currentState = 'EXPULSO';
                clearInterval(timerInterval);
                document.getElementById('studentQuizCard').classList.add('hidden');
                document.getElementById('studentLockModal').classList.add('hidden');
                document.getElementById('studentWaitModal').classList.add('hidden');
                document.getElementById('studentKickedModal').classList.remove('hidden');
                client.publish(`quizguard/${roomCode}/std/${myId}`, '', {retain: true});
                try { document.exitFullscreen(); } catch(e){}
            }
        }

        if(parts[2] === 'std' && isTeacher) {
            if(!msg) delete liveStudentsData[parts[3]]; else liveStudentsData[parts[3]] = JSON.parse(msg);
            renderTeacherRadar();
        }
        if(parts[2] === 'sub' && isTeacher) {
            submissionsData.push(JSON.parse(msg));
            renderSubmissions();
        }
    });

    // 5. ENTRADA DO ALUNO
    document.getElementById('btnStartTest').addEventListener('click', () => {
        roomCode = document.getElementById('studentRoomCode').value.trim();
        const name = document.getElementById('studentName').value.trim();
        if(!roomCode || !name) return alert("Insira a sala e o nome.");

        client.subscribe(`quizguard/${roomCode}/questions`);
        document.getElementById('btnStartTest').innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> A ligar à sala...";

        setTimeout(() => {
            if(!downloadedBank || downloadedBank.length === 0) {
                alert("A sala não foi encontrada ou ainda não tem perguntas carregadas pelo professor.");
                document.getElementById('btnStartTest').innerHTML = "Entrar na Sala (F11)";
                return;
            }

            let limit = downloadedBank.length >= 30 ? 30 : downloadedBank.length;
            myTestQuestions = downloadedBank.sort(() => 0.5 - Math.random()).slice(0, limit);
            studentAnswers = new Array(limit).fill(null);
            document.getElementById('totalQNum').textContent = limit;

            myId = 'STD_' + Date.now();
            document.getElementById('displayStudentName').textContent = name;
            client.subscribe(`quizguard/${roomCode}/cmd/${myId}`);
            
            timeRemainingSeconds = (document.getElementById('settingDuration').value || 30) * 60;

            document.getElementById('studentRegCard').classList.add('hidden');
            document.getElementById('studentQuizCard').classList.remove('hidden');

            currentState = 'A_AGUARDAR';
            document.getElementById('studentWaitModal').classList.remove('hidden');
            
            injectQuestionJS(0);
            publishState();
        }, 1200);
    });

    function publishState() {
        if(!roomCode || !myId) return;
        client.publish(`quizguard/${roomCode}/std/${myId}`, JSON.stringify({
            id: myId, name: document.getElementById('studentName').value,
            status: currentState, currentQ: currentQIndex + 1, infractions: myInfractions
        }), {retain: true});
    }

    function injectQuestionJS(index) {
        currentQIndex = index;
        const q = myTestQuestions[index];
        document.getElementById('currentQNum').textContent = index + 1;
        document.getElementById('quizProgressBar').style.width = `${((index + 1) / myTestQuestions.length) * 100}%`;

        let html = `<h3>${index + 1}. ${q.text}</h3><div class="options-list">`;
        q.options.forEach((opt, i) => {
            let isChecked = studentAnswers[index] === i ? 'checked' : '';
            html += `<label class="option-label ${isChecked ? 'selected' : ''}">
                <input type="radio" name="js_qopt" value="${i}" ${isChecked}> ${opt}
            </label>`;
        });
        html += `</div>`;

        document.getElementById('dynamicQuizContainer').innerHTML = html;

        document.querySelectorAll('input[name="js_qopt"]').forEach(r => {
            r.addEventListener('change', (e) => {
                document.querySelectorAll('.option-label').forEach(l => l.classList.remove('selected'));
                e.target.closest('.option-label').classList.add('selected');
                studentAnswers[currentQIndex] = parseInt(e.target.value);
                publishState();
            });
        });

        document.getElementById('btnPrevQ').disabled = index === 0;
        if(index === myTestQuestions.length - 1) {
            document.getElementById('btnNextQ').classList.add('hidden');
            document.getElementById('btnSubmitTest').classList.remove('hidden');
        } else {
            document.getElementById('btnNextQ').classList.remove('hidden');
            document.getElementById('btnSubmitTest').classList.add('hidden');
        }
    }

    // ANTI-CHEAT
    window.addEventListener('blur', () => triggerAntiCheat("Saiu da aba (Alt-Tab / Foco)"));
    document.addEventListener('visibilitychange', () => { if(document.hidden) triggerAntiCheat("Minimizou o navegador"); });
    document.addEventListener('fullscreenchange', () => { if(!document.fullscreenElement) triggerAntiCheat("Saiu do modo ecrã inteiro"); });

    function triggerAntiCheat(reason) {
        if(currentState !== 'EM_TESTE') return;
        currentState = 'BLOQUEADO';
        myInfractions.push({ time: new Date().toLocaleTimeString(), reason: reason });
        document.getElementById('lockTitleText').textContent = "TESTE BLOQUEADO";
        document.getElementById('lockReasonText').textContent = "Motivo: " + reason;
        document.getElementById('studentLockModal').classList.remove('hidden');
        publishState();
    }

    document.getElementById('btnNextQ').addEventListener('click', () => {
        if(currentQIndex < myTestQuestions.length - 1) injectQuestionJS(currentQIndex + 1);
        publishState();
    });
    document.getElementById('btnPrevQ').addEventListener('click', () => {
        if(currentQIndex > 0) injectQuestionJS(currentQIndex - 1);
        publishState();
    });

    function startTimer() {
        if(timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if(currentState !== 'EM_TESTE') return;
            timeRemainingSeconds--;
            if(timeRemainingSeconds <= 0) {
                submitTest("Tempo Esgotado");
            } else {
                let m = Math.floor(timeRemainingSeconds / 60).toString().padStart(2, '0');
                let s = (timeRemainingSeconds % 60).toString().padStart(2, '0');
                document.getElementById('timeLeft').textContent = `${m}:${s}`;
            }
        }, 1000);
    }

    document.getElementById('btnSubmitTest').addEventListener('click', () => {
        if(confirm("Deseja submeter e terminar o teste?")) submitTest("Submissão Voluntária");
    });

    function submitTest(reason) {
        clearInterval(timerInterval);
        currentState = 'TERMINADO';
        let val = 20 / myTestQuestions.length, penalty = val / 4;
        let c = 0, w = 0, b = 0;
        studentAnswers.forEach((ans, idx) => {
            if(ans === null) b++;
            else if(ans === myTestQuestions[idx].correct) c++;
            else w++;
        });
        let finalScore = Math.max(0, (c * val) - (w * penalty)).toFixed(2);

        client.publish(`quizguard/${roomCode}/sub/${myId}`, JSON.stringify({
            id: myId, name: document.getElementById('studentName').value, score: finalScore,
            details: `${c} Certas, ${w} Erradas, ${b} Brancas`, infractions: myInfractions, status: reason
        }));
        client.publish(`quizguard/${roomCode}/std/${myId}`, '', {retain: true});

        document.getElementById('studentQuizCard').classList.add('hidden');
        document.getElementById('studentLockModal').classList.add('hidden');
        document.getElementById('studentResultCard').classList.remove('hidden');
        document.getElementById('finalScoreVal').textContent = finalScore;
        document.getElementById('scoreDetailsText').textContent = `${c} Certas | ${w} Erradas | ${b} Brancas`;
        try { document.exitFullscreen(); } catch(e){}
    }

    // 6. PROFESSOR RADAR
    function renderTeacherRadar() {
        const tbody = document.getElementById('liveStudentsTable').querySelector('tbody');
        tbody.innerHTML = '';
        const students = Object.values(liveStudentsData);
        if(students.length === 0) { tbody.innerHTML = `<tr><td colspan="4">Nenhum aluno ativo.</td></tr>`; return; }

        students.forEach(s => {
            let tr = document.createElement('tr');
            let statusBadge = '', actions = '';

            if(s.status === 'A_AGUARDAR') {
                tr.style.background = "rgba(59, 130, 246, 0.1)";
                statusBadge = `<span class="live-badge" style="background:var(--info)">Na Sala de Espera</span>`;
                actions = `<button class="btn success btn-icon" onclick="window.tCmd('${s.id}', 'start_test')"><i class="fa-solid fa-play"></i> Iniciar</button>
                           <button class="btn danger btn-icon" onclick="window.tCmd('${s.id}', 'kick')"><i class="fa-solid fa-door-open"></i> Expulsar</button>`;
            } else if(s.status === 'BLOQUEADO' || s.status === 'PAUSADO') {
                tr.style.background = "rgba(239, 68, 68, 0.1)";
                statusBadge = `<span class="live-badge" style="background:var(--danger)">${s.status}</span><br><small style="color:red;">${s.infractions.length ? s.infractions[s.infractions.length-1].reason : 'Congelado'}</small>`;
                
                actions = `<div class="action-group">
                    <button class="btn success btn-icon" title="Desbloquear" onclick="window.tCmd('${s.id}', 'unlock')"><i class="fa-solid fa-play"></i> Desbloquear</button>
                    <button class="btn warning btn-icon" title="Desbloquear tirando tempo" onclick="window.tCmd('${s.id}', 'unlock_time')"><i class="fa-solid fa-clock-rotate-left"></i> (- Tempo)</button>
                    <button class="btn danger btn-icon" title="Expulsar" onclick="window.tCmd('${s.id}', 'kick')"><i class="fa-solid fa-door-open"></i> Expulsar</button>
                </div>`;
            } else {
                statusBadge = `<span class="live-badge">A Fazer Teste</span>`;
                actions = `<div class="action-group">
                    <button class="btn warning btn-icon" title="Pausar Ecrã" onclick="window.tCmd('${s.id}', 'force_pause')"><i class="fa-solid fa-hand"></i> Pausar</button>
                    <button class="btn danger btn-icon" title="Expulsar" onclick="window.tCmd('${s.id}', 'kick')"><i class="fa-solid fa-door-open"></i> Expulsar</button>
                </div>`;
            }

            tr.innerHTML = `<td><strong>${s.name}</strong></td><td>${statusBadge}</td><td><strong style="color:var(--primary);">P. ${s.currentQ}/30</strong></td><td>${actions}</td>`;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('btnStartAllWaiting').addEventListener('click', () => {
        Object.values(liveStudentsData).forEach(s => {
            if(s.status === 'A_AGUARDAR') client.publish(`quizguard/${roomCode}/cmd/${s.id}`, JSON.stringify({ action: 'start_test' }));
        });
    });

    window.tCmd = (id, action) => {
        let payload = { action: action };
        if(action === 'kick' && !confirm("Tem a certeza que deseja expulsar este aluno?")) return;
        if(action === 'unlock_time') {
            let m = prompt("Quantos MINUTOS deseja retirar ao aluno de penalização?");
            if(!m || isNaN(m)) return;
            payload.amount = parseInt(m) * 60;
        }
        client.publish(`quizguard/${roomCode}/cmd/${id}`, JSON.stringify(payload));
    };

    function renderSubmissions() {
        const tbody = document.getElementById('submissionsTable').querySelector('tbody');
        tbody.innerHTML = '';
        submissionsData.slice().reverse().forEach(sub => {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${sub.name}</strong><br><small>${sub.status}</small></td>
                <td><strong style="color:var(--primary); font-size:1.1rem;">${sub.score}/20</strong></td>
                <td>${sub.infractions.length} infrações</td>
                <td><button class="btn secondary btn-icon" onclick="alert('Respostas: ${sub.details}\\n\\nInfrações:\\n' + JSON.stringify('${sub.infractions}'))"><i class="fa-solid fa-eye"></i></button></td>`;
            tbody.appendChild(tr);
        });
    }
})();