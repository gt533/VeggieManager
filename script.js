const copyButton = document.getElementById('copyButton')
const resultText = document.getElementById('resultText')
const message = document.getElementById('message')

document.getElementById('input-default-price').value = localStorage.getItem("defaultPrice");
document.getElementById('input-price').value = localStorage.getItem("priceList");

function calculate() {
    const initialStockList = parseInput(document.getElementById('initialStock').value);
    const collectedItemsList = parseInput(document.getElementById('collectedItems').value);
    const addedItemsList = parseInput(document.getElementById('addedItems').value);
    const closingStockList = parseInput(document.getElementById('closingStock').value);
    const defaultPrice = parseInt(document.getElementById('input-default-price').value);
    const priceList = parseInput(document.getElementById('input-price').value);

    let sales = {};
    let revenue = {};
    let sum = 0;

    for (let item in addedItemsList) {
        if (!(item in initialStockList)) {
            initialStockList[item] = 0;
        }
    }

    for (let item in initialStockList) {
        const initial = initialStockList[item];
        const collected = collectedItemsList[item] || 0;
        const added = addedItemsList[item] || 0;
        const closing = closingStockList[item] || 0;
        const price = priceList[item] || defaultPrice;
        sales[item] = initial + added - collected - closing;
        revenue[item] = sales[item] * price;
        sum += revenue[item];
    }

    str = "";
    str += "【開店時の在庫】\n" + toText(initialStockList, "");
    if (collectedItemsList.count > 0) {
        str += "\n【回収】\n" + toText(collectedItemsList, "");
    }
    if (addedItemsList.count > 0) {
        str += "\n【追加】\n" + toText(addedItemsList, "");
    }
    str += "\n【閉店時の在庫】\n" + toText(closingStockList, "");
    str += "\n【販売数】\n" + toText(sales, "個");
    str += "\n【売上】\n" + toText(revenue, "円");
    str += "\n【総売上】" + sum + "円";

    resultText.value = str;

    document.getElementById('sales').innerText = toText(sales, "個");
    document.getElementById('revenue').innerText = toText(revenue, "円");
    document.getElementById('sum').innerText = sum + "円";

    localStorage.setItem("defaultPrice",document.getElementById('input-default-price').value);
    localStorage.setItem("priceList",document.getElementById('input-price').value);
}

function parseInput(input) {
    const lines = input.split('\n');
    let output = {};
    for (let line of lines) {
        const parts = line.split(':');
        if (parts.length == 2) {
            const item = parts[0].trim();
            const count = parseInt(parts[1].trim());
            if (item && !isNaN(count)) {
                output[item] = count;
            }
        }
    }
    return output;
}

function toText(input, endwith) {
    let str = "";
    for (let item in input) {
        if (!isNaN(input[item]) && input[item] > 0) {
            str += item + ":" + input[item] + endwith + "\n";
        }
    }
    return str;
}



// クリップボードへコピー（ボタンをクリックした時）
copyButton.addEventListener('click', () => {
    const tagValue = resultText.value
    copyToClipboard(tagValue)
})

// クリップボードへコピー（コピーの処理）
function copyToClipboard(tagValue) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(tagValue).then(function () {
            messageActive()
        })
    } else {
        resultText.select()
        document.execCommand('copy')
        messageActive()
    }
}

// メッセージを表示
function messageActive() {
    message.classList.add('is-active')
    setTimeout(() => {
        message.classList.remove('is-active')
    }, 1600)
}
