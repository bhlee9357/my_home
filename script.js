document.addEventListener('DOMContentLoaded', function() {
    initializeMembers();
    initializeSeats();
    setupDragAndDrop();
});

const partColors = {
    1: "lightpink",
    2: "lightgreen",
    3: "lightblue",
    4: "lightgrey"
};

const partNames = {
    1: "소프라노",
    2: "알토",
    3: "테너",
    4: "베이스"
};

const members = [
    { name: "대원1", part: 1 },
    { name: "대원2", part: 2 },
    { name: "대원3", part: 3 },
    { name: "대원4", part: 4 }
    // ... 추가 대원 정보
];

function initializeMembers() {
    const memberList = document.getElementById('member-list');
    
    Object.keys(partNames).forEach(part => {
        const partTitle = document.createElement('h3');
        partTitle.textContent = partNames[part];
        memberList.appendChild(partTitle);

        members.filter(member => member.part == part).forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.classList.add('member');
            memberElement.textContent = member.name;
            memberElement.dataset.part = part;
            memberElement.setAttribute('draggable', true);
            memberList.appendChild(memberElement);
        });
    });
}

function initializeSeats() {
    const seatMap = document.getElementById('seat-map');
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 10; col++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            seat.dataset.seatNumber = `${row}-${col}`;
            seat.style.backgroundColor = 'white';
            seatMap.appendChild(seat);
        }
    }
}

function setupDragAndDrop() {
    const members = document.querySelectorAll('.member');
    const seats = document.querySelectorAll('.seat');

    members.forEach(member => {
        member.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', member.textContent);
            e.dataTransfer.setData('part', member.dataset.part);
            e.dataTransfer.effectAllowed = 'move';
        });
    });

    seats.forEach(seat => {
        seat.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        seat.addEventListener('drop', function(e) {
            e.preventDefault();
            if (e.dataTransfer.types.includes('text/plain')) {
                const memberName = e.dataTransfer.getData('text/plain');
                const memberPart = e.dataTransfer.getData('part');

                if (seat.textContent === '' || seat.textContent === '공석') {
                    seat.textContent = memberName;
                    seat.style.backgroundColor = partColors[memberPart];
                    seat.dataset.part = memberPart;
                    removeMemberFromList(memberName);
                }
            }
        });

        seat.addEventListener('dragstart', function(e) {
            if (seat.textContent !== '' && seat.textContent !== '공석') {
                e.dataTransfer.setData('text/plain', seat.textContent);
                e.dataTransfer.setData('part', seat.dataset.part);
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        seat.addEventListener('dragend', function(e) {
            if (e.dataTransfer.dropEffect === 'none') {
                addMemberToList(seat.textContent, seat.dataset.part);
                seat.textContent = '공석';
                seat.style.backgroundColor = 'white';
                delete seat.dataset.part;
            }
        });
    });
}

function removeMemberFromList(memberName) {
    const members = document.querySelectorAll('.member');
    members.forEach(member => {
        if (member.textContent === memberName) {
            member.parentNode.removeChild(member);
        }
    });
}

function addMemberToList(memberName, part) {
    const memberList = document.getElementById('member-list');
    const partTitle = memberList.querySelector(`h3:contains(${partNames[part]})`);
    const newMember = document.createElement('div');
    newMember.classList.add('member');
    newMember.textContent = memberName;
    newMember.dataset.part = part;
    newMember.setAttribute('draggable', true);
    memberList.insertBefore(newMember, partTitle.nextSibling);
}
