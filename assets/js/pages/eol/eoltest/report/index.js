const params = new URLSearchParams(window.location.search);
const memberId = params.get('member_id') || '';

fetch(`/api/eol/report/selector?member_id=${encodeURIComponent(memberId)}`, {
  credentials: 'include'
}).then((res) => res.json()).then((data) => {
  if (data.status === 200) {
    const accountType = data.data.accountType;
    console.log('hello', accountType);
    console.table(data);
    console.table(data.data.focus);

    document.getElementById('selector-class').className = accountType === 'master' || data.data.corporate ? 'sub-member' : 'personal';

    if (data.data.corporate === true || accountType === 'master') {
      document.getElementById('report-button-contest').style.display = 'block';
      document.getElementById('selector-text').textContent = 'ตรวจเช็คดูผลการฝึกฝนและเรียนรู้ในห้องทดสอบ 3 ฟังชั่น';
    } else {
      document.getElementById('report-button-contest').style.display = 'none';
      document.getElementById('selector-text').textContent = 'ตรวจเช็คดูผลการฝึกฝนและเรียนรู้ในห้องทดสอบ 2 ฟังชั่น';
    }
  } else {
    console.log(data);
  }
});
