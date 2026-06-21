class User {
    constructor({ id, name, email }) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    /**
     * DB에서 조회한 한 줄(Row)의 데이터를 User 인스턴스로 변환하는 팩토리 메서드
     */
    static fromRow(row) {
        if (!row) return null;
        return new User({
            id: row.id,
            name: row.name,
            email: row.email
        });
    }

    /**
     * 필요 시 비즈니스 로직이나 유틸리티 메서드 추가 가능
     * 예: 민감한 정보를 제외하고 JSON으로 직렬화할 때 사용
     */
    toJson() {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        };
    }
}

module.exports = User;
