const display = document.getElementById('display');
const history = document.getElementById('history');
let expressao = "";
let novoNumero = true;
let operacaoPendente = null;
let valorPendente = null;

const atualizarDisplay = (texto) => {
    display.textContent = texto.toString().replace('.', ',');
};

const atualizarHistorico = () => {
    history.textContent = expressao;
};

document.querySelectorAll('[id*=tecla]').forEach((numero) => {
    numero.addEventListener('click', (evento) => {
        if (novoNumero) {
            display.textContent = evento.target.textContent;
            novoNumero = false;
        } else {
            display.textContent += evento.target.textContent;
        }
        expressao += evento.target.textContent;
        atualizarHistorico();
    });
});

document.querySelectorAll('[id*=operador]').forEach((operador) => {
    operador.addEventListener('click', (evento) => {
        expressao += ` ${evento.target.textContent} `;
        atualizarHistorico();
        novoNumero = true;
    });
});

function definirOperacao(func, nome) {
    if (display.textContent !== "") {
        valorPendente = parseFloat(display.textContent.replace(',', '.'));
        expressao = `${nome}(${valorPendente})`;
        atualizarHistorico();
        operacaoPendente = func;
        novoNumero = true;
    }
}

document.getElementById('igual').addEventListener('click', () => {
    try {
        let resultado;
        if (operacaoPendente && valorPendente !== null) {
            resultado = operacaoPendente(valorPendente);
            operacaoPendente = null;
            valorPendente = null;
        } else {
            resultado = eval(expressao.replace(',', '.'));
        }
        atualizarHistorico(`${expressao} = ${resultado}`);
        atualizarDisplay(resultado);
        expressao = resultado.toString();
        novoNumero = true;
    } catch {
        atualizarDisplay("Erro");
    }
});

document.getElementById('limparDisplay').addEventListener('click', () => {
    display.textContent = '';
    history.textContent = '';
    expressao = "";
    novoNumero = true;
    operacaoPendente = null;
    valorPendente = null;
});

document.getElementById('limparCalculo').addEventListener('click', () => {
    if (expressao.length > 0) {
        let ultimoValor = expressao.split(/(\+|\-|\*|\/|\!|\%|\^|\√|\,)/).filter(Boolean).pop();
        expressao = expressao.slice(0, expressao.length - ultimoValor.length); 
        atualizarHistorico(); 
    }
    novoNumero = true; 
});


document.getElementById('inverter').addEventListener('click', () => {
    if (display.textContent !== "") {
        let valorAtual = parseFloat(display.textContent.replace(',', '.'));
        let valorInvertido = -valorAtual;
        atualizarDisplay(valorInvertido);
        expressao = expressao.replace(valorAtual.toString(), valorInvertido.toString());
        atualizarHistorico();
    }
});

document.getElementById('decimal').addEventListener('click', () => {
    if (!display.textContent.includes(',')) {
        display.textContent += ',';
        expressao += ',';
        atualizarHistorico();
    }
});

document.getElementById('backspace').addEventListener('click', () => {
    if (display.textContent.length > 0) {
        display.textContent = display.textContent.slice(0, -1); 
        expressao = expressao.slice(0, -1); 
        atualizarHistorico(); 
    }
});

document.getElementById('sqrt').addEventListener('click', () => definirOperacao(Math.sqrt, '√'));
document.getElementById('potencia').addEventListener('click', () => {
    if (display.textContent !== "") {
        valorPendente = parseFloat(display.textContent.replace(',', '.'));
        expressao = `${valorPendente}²`;
        atualizarHistorico();
        operacaoPendente = x => x ** 2;
        novoNumero = true;
    }
});
document.getElementById('seno').addEventListener('click', () => definirOperacao(x => Math.sin(x * Math.PI / 180), 'sin'));

document.getElementById('cosseno').addEventListener('click', () => {
    definirOperacao(x => {
      const radiano = x * Math.PI / 180; 
      const resultado = Math.cos(radiano); 
      
      return Math.abs(resultado) < 1e-10 ? 0 : resultado;
    }, 'cos');
  });

document.getElementById('tangente').addEventListener('click', () => {
    definirOperacao(x => {
      if (x % 180 === 90 || x % 180 === -90) {
        return 'Erro'; 
      } else {
        const radiano = x * Math.PI / 180;
        const resultado = Math.tan(radiano); 
        return resultado % 1 === 0 ? resultado : parseFloat(resultado.toFixed(10)); 
      }
    }, 'tan');
  });  
  
document.getElementById('logaritmo').addEventListener('click', () => definirOperacao(Math.log10, 'log'));
document.getElementById('ln').addEventListener('click', () => definirOperacao(Math.log, 'ln'));

document.getElementById('porcentagem').addEventListener('click', () => {
    if (display.textContent !== "") {
        let valor = parseFloat(display.textContent.replace(',', '.')); 
        valor = valor / 100; 
        expressao = valor.toString(); 
        atualizarHistorico(); 
        atualizarDisplay(valor); 
        novoNumero = true; 
    }
});

document.getElementById('fatorial').addEventListener('click', () => {
    if (display.textContent !== "") {
        valorPendente = parseFloat(display.textContent.replace(',', '.'));
        expressao = `${valorPendente}!`; 
        atualizarHistorico();
        operacaoPendente = valor => {
            if (!isNaN(valor) && valor >= 0) {
                function fatorial(n) { return n <= 1 ? 1 : n * fatorial(n - 1); }
                return fatorial(valor);
            } else {
                return "Erro";
            }
        };
        novoNumero = true;
    }
});

document.getElementById('pi').addEventListener('click', () => {
    if (novoNumero) {
      display.textContent = Math.PI;  
      expressao += Math.PI;  
      novoNumero = false;  
    } else {
      display.textContent += Math.PI;  
      expressao += Math.PI;  
    }
    atualizarHistorico();
  });
