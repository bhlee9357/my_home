document.addEventListener('DOMContentLoaded', function() {
    initializeSeatMap();
    initializeEventListeners();
});

const partColors = {
    0: "white",
    1: "lightpink",
    2: "lightgreen",
    3: "lightblue",
    4: "lightgrey"
};

const partNames = {
    0: "����",
    1: "�������",
    2: "����",
    3: "�׳�",
    4: "���̽�"
};

const members = [
    { name: "���1", part: 1 },
    { name: "���2", part: 2 },
    // ... �߰� ���
];

let selectedSeat = null;

function initializeSeatMap() {
    const seatMap = document.getElementById('seat-map');
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 10; col++) {
            seatMap.appendChild(createSeatButton(row, col));
        }
    }
}

function createSeatButton(row, col) {
    const seatButton = document.createElement('button');
    seatButton.classList.add('seat');
    seatButton.setAttribute('data-position', `${row}-${col}`);
    seatButton.textContent = '����';
    seatButton.style.backgroundColor = partColors[0];
    seatButton.addEventListener('click', onSeatClick);
    return seatButton;
}

function onSeatClick() {
    selectedSeat = this;
    updateAvailableMembers();
    document.getElementById('seatSelectionModal').style.display = 'block';
}

function updateAvailableMembers() {
    const occupiedNames = getOccupiedNames();
    const memberSelect = document.getElementById('memberSelect');
    memberSelect.innerHTML = '<option value="0">����</option>';
    members.forEach(member => {
        if (!occupiedNames.has(member.name)) {
            memberSelect.appendChild(createMemberOption(member));
        }
    });
}

function createMemberOption(member) {
    const option = document.createElement('option');
    option.value = member.name;
    option.textContent = `${member.name} (${partNames[member.part]})`;
    return option;
}

function getOccupiedNames() {
    return new Set(Array.from(document.querySelectorAll('.seat'))
        .filter(seat => seat.textContent !== '����')
        .map(seat => seat.textContent));
}

function initializeEventListeners() {
    document.getElementById('confirmSelection').addEventListener('click', confirmSeatSelection);
    document.getElementById('cancelSelection').addEventListener('click', () => {
        document.getElementById('seatSelectionModal').style.display = 'none';
    });
    document.getElementById('saveLayout').addEventListener('click', saveSeatLayout);
    document.getElementById('loadLayout').addEventListener('click', () => document.getElementById('loadInput').click());
    document.getElementById('loadInput').addEventListener('change', loadSeatLayout);
    document.getElementById('resetLayout').addEventListener('click', resetSeatLayout);
}

function confirmSeatSelection() {
    const selectedMemberName = document.getElementById('memberSelect').value;
    const selectedMember = members.find(member => member.name === selectedMemberName);
    const part = selectedMember ? selectedMember.part : 0;
    selectedSeat.textContent = selectedMemberName !== "0" ? selectedMemberName : '����';
    selectedSeat.style.backgroundColor = partColors[part];
    document.getElementById('seatSelectionModal').style.display = 'none';
}

function saveSeatLayout() {
    const layoutData = Array.from(document.querySelectorAll('.seat')).map(seat => {
        return {
            position: seat.getAttribute('data-position'),
            name: seat.textContent,
            part: Object.keys(partColors).find(key => partColors[key] === seat.style.backgroundColor)
        };
    });

    const filename = prompt("������ ���� �̸��� �Է��ϼ���:", "layout.json");
    if (filename) {
        const blob = new Blob([JSON.stringify(layoutData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

function loadSeatLayout(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const layoutData = JSON.parse(e.target.result);
        layoutData.forEach(data => {
            const seat = document.querySelector(`.seat[data-position="${data.position}"]`);
            seat.textContent = data.name;
            seat.style.backgroundColor = partColors[data.part];
        });
    };
    reader.readAsText(file);
}

function resetSeatLayout() {
    document.querySelectorAll('.seat').forEach(seat => {
        seat.textContent = '����';
        seat.style.backgroundColor = partColors[0];
    });
}
