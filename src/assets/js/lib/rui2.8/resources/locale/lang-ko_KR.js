Rui.namespace('Rui.message.locale.ko_KR');
Rui.applyObject(Rui.message.locale.ko_KR, {
    locale: 'ko_KR',
    core: {
        monthInYear: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
        monthInYear1Char: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        shortMonthInYear: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        dayInWeek: ['일요일', '월요일', '화요일', '수요일','목요일', '금요일', '토요일'],
        shortDayInWeek: ['일', '월', '화', '수','목', '금', '토'],
        weekdays1Char: ['일','월','화','수','목','금','토'],
        startWeekDay: 0,
        localeMonths: 'long',
        localeWeekdays: '1char',
        dateDelimiter: ',',//복수 날짜 구분자
        dateRangeDelimiter: '~',//범위 표시시 날짜 구분자, -은 날짜 구분자로 사용될 수 있으므로 사용하면 안된다.
        myLabelMonthSuffix: '월',
        myLabelYearSuffix: '년',
        calendarNavigatorLabelMonth: '월',
        calendarNavigatorLabelYear: '년',
        kor: '한글',
        eng: '영어',
        num: '숫자',
        currencyRegExp : /^-?(((\d{1,3},?)(\d{3},?)+|\d{1,3})|\d+)(\.\d+)?$/gm
    },
    base: {
        msg001: '필수 입력 항목입니다.',
        msg002: '공백없이 입력하십시오.',
        msg003: '@자리수만큼 입력하십시오.',
        msg004: '@부터 @사이로 입력하십시오.',
        msg005: '숫자만을 입력하십시오.',
        msg006: '문자만을 입력하십시오.',
        msg007: '숫자와 문자만을 입력하십시오.(공백제외)',
        msg008: '숫자와 문자만을 입력하십시오.(공백포함)',
        msg009: '@자 이상으로 입력하십시오.',
        msg010: '@자 이하로 입력하십시오.',
        msg011: '@ 이상으로 입력하십시오.',
        msg012: '@ 이하로 입력하십시오.',
        msg013: '년도가 잘못되었습니다.',
        msg014: '유효한 주민등록번호가 아닙니다.',
        msg015: '유효한 사업자등록번호가 아닙니다.',
        msg016: '유효한 날짜가 아닙니다.',
        msg017: '월이 잘못되었습니다.',
        msg018: '일이 잘못되었습니다.',
        msg019: '시가 잘못되었습니다.',
        msg020: '분이 잘못되었습니다.',
        msg021: '초가 잘못되었습니다.',
        msg022: '@년 @월 @일 이후이어야 합니다.',
        msg023: '@년 @월 @일 이전이어야 합니다.',
        msg024: '\'@\' 형식이어야 합니다.\n  - #: 문자 혹은 숫자\n  - h, H: 한글(H는 공백포함)\n  - A, Z: 문자(Z는 공백포함)\n  - 0, 9: 숫자(9는 공백포함)',
        msg029: '@Byte 만큼 입력하십시오. (한글은 @자리수)',
        msg030: '@Byte 이상으로 입력하십시오. (한글은 @자 이상)',
        msg031: '@Byte 이하로 입력하십시오. (한글은 @자 이하)',
        //msg032: '----미정',
        msg033: '@ 문자는 사용할 수 없습니다.',
        msg034: '유효한 이메일 주소가 아닙니다.',
        msg035: '정수부를 @자 이하로 입력하십시오.',
        msg036: '소수부를 @자로 입력하십시오.',
        msg037: '\'@\' 형식으로 입력하십시오.',
        msg038: '\'@\' 만 사용 가능합니다.',
        msg039: '@개 이상 선택되어야 합니다.',
        msg040: '유효한 시간이 아닙니다.',
        msg041: '레코드를 이동할 수 없습니다.',
        msg042: '이전',
        msg043: '다음',
        msg044: '확인',
        msg050: 'Validator 표현식이 잘못되었습니다. (@)',
        msg051: 'Validator 표현식에서 해당 검사항목은 존재하지 않습니다. (@)',
        msg052: '유효하지 않습니다.',
        msg100: '성공하였습니다.',
        msg101: '실패했습니다. 브라우저 혹은 서버 측 로그를 확인해보시기 바랍니다.',
        msg102: '변경된 데이터가 없습니다.',
        msg103: '해당 페이지를 찾을 수 없습니다.',
        msg104: '알 수 없는 에러가 발생했습니다.',
        msg105: '추가하시겠습니까?',
        msg106: '수정하시겠습니까?',
        msg107: '삭제하시겠습니까?',
        msg108: '선택하세요.',
        msg109: '적용이 완료되었습니다.',
        msg110: '서버에서 알수 없는 메시지가 응답되었습니다.',
        msg111: '이메일주소를 입력하세요.',
        msg112: '응답시간이 초과되었습니다.',
        msg113: '클립보드에 저장하는데 실패했습니다.',
        msg114: '브라우져의 설정이 클립보드에 접근할 권한이 없습니다. about: config 설정 필요',
        msg115: '검색 결과가 없습니다.',
        msg116: '데이터건이 너무 많습니다. 최대: @건',
        msg117: 'filter시 변경된 데이터는 초기화 됩니다.',
        msg118: '날짜를 선택하세요.',
        msg119: '전체',
        msg120: '적용',
        msg121: '취소',
        msg122: '소계',
        msg123: '합계',
        msg124: '닫기',
        msg125: '클립보드',
        msg126: '첫번째 행 입니다.',
        msg127: '마지막 행 입니다.',
        msg128: '복사',
        msg129: '붙여넣기',
        msg130: '※ 이 브라우저는 클립보드에 접근을 허용하지 않습니다. RUI에서는 허용되지 않는 브라우저의 경우에 이 다이얼로그가 열립니다.<br/> 위의 영역에서 복사/붙여넣기를 하세요.',
        msg131: '다운로드 방식을 선택하세요. 총 : [@] 건',
        msg132: '셀병합을 제외하면 성능이 약간 향상됩니다.',
        msg133: '대용량의 데이터는 [셀병합 제외]을 선택하세요.',
        msg134: '셀병합 포함',
        msg135: '셀병합 제외',
        msg136: '계산된 셀 갯수',
        msg137: '계산에서 제외된 셀 갯수',
        msg138: '평균',
        msg139: '계산',
        msg140: '클립보드의 데이터를 적용하였습니다.',
        msg141: '클립보드에 데이터를 복사하였습니다.',
        msg142: '브라우저 혹은 서버 측 로그를 확인해보시기 바랍니다.',
        msg143: '유효한 통화 형식이 아닙니다.'
        // 이곳은 RUI의 기본 메시지 라이브러리 입니다. 이 영역에 메시지를 추가하지 마세요.
    },
    ext: {
        msg001: '엑셀 저장',
        msg002: '틀고정',
        msg003: '정렬',
        msg004: '필터',
        msg005: '오름',
        msg006: '내림',
        msg007: '최대 @건 제한',
        msg008: '기본 메뉴',
        msg009: '컬럼 메뉴',
        msg010: '정보',
        msg011: '컬럼넓이맞춤(데이터)',
        msg012: '컬럼 넓이 맞춤',
        msg013: '필터 초기화',
        msg014: '적용안함',
        msg015: '컬럼넓이맞춤(그리드)',
        msg016: '성능이 느린 브라우져를 사용하고 있습니다. 쾌적환 환경을 위해 브라우저를 업그레이드하거나 다른 브라우져를 사용하십시오. 성능이 최소 2배 이상 차이가 납니다. <a href="http://browsehappy.com/">브라우져 다운로드</a>',
        msg017: '조회된 자료가 @건입니다. 다소 시간이 걸려도 진행하시겠습니까? ',
        msg018: '시작일자',
        msg019: '종료일자',
        msg020: '기간을 선택하세요.',
        msg021: '검색',
        msg022: '시작일과 종료일이 잘못 입력되었습니다.',
        msg023: '선택된 파일이 없습니다.'
        // 이곳은 RUI의 확장 메시지 라이브러리 입니다. 이 영역에 메시지를 추가하지 마시고 아래 'message' 영역에 추가하여 사용하세요.
    },
    pivot: {
        msg001: '개수',
        msg002: '합계',
        msg003: '평균',
        msg004: '최소값',
        msg005: '최대값',
        msg006: '요약',
        msg007: '구분',
        msg008: '총합계',
    },    
    message: {
        // 이곳에 프로젝트 공통 메시지를 추가하여 사용하세요.
    	sample: 'Custom Validator Sample Test Message',
        forProject: '@ 프로젝트용 메시지 영역 입니다.'
    }
});

var configLocale = Rui.message.locale.ko_KR.core;

Rui.util.LDateLocale['ko_KR'] = Rui.merge(Rui.util.LDateLocale['ko_KR'], {
//        x: '%Y-%m-%d',
//        X: '%Y-%m-%d %T',
//        q: '%d%m%Y',
//        Q: '%d%m%Y %T',
        a: configLocale.shortDayInWeek,
        A: configLocale.dayInWeek,
        b: configLocale.shortMonthInYear,
        B: configLocale.monthInYear1Char
});

Rui.message.locale.ko_KR.moneyFormat = function(v) {
    return Rui.util.LNumber.toMoney(v, '￦');
};

Rui.message.locale.ko_KR.numberFormat = function(v) {
    return Rui.util.LNumber.format(v, { thousandsSeparator: ',' });
};