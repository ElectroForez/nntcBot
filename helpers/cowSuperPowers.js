/*
* Контроллер разграничения доступа в зависимости от статуса пользователя
* Студент может смотреть расписание. Избранные студенты могут открывать дверь ВЦ. Если студент
* не имеет права на открытие двери, ему предлагают обратиться к одному из администраторов системы.
*
* Учитель не может изменять права других пользователей и получать логи системы.
*
* Админ- админ, может все. Может просматривать информацию о пользователях, вешать на них заметки
* изменять права (в целях безопасности, админ не может сотворить другого админа. Другого админа
* можно сотворить только вручную в базе), может давать избранным студентам доступ к открывашке двери
* */
const strings = require('../resources/strings');
const users = require('../models/users');

module.exports.hasAccess = (status, requestType, request, opener = true) => {
    switch (status) {
        case "student":
            if((requestType === "message") && strings.listsOfRights.students.includes(request)){
                if(request === strings.keyboardConstants.VC){
                    return opener;
                }
                return true;
            }else{
                return false;
            }
        case "teacher":
            break;
        case "admin":
            return true;
        default:
            return false;
    }
}

/**
 * Получает из базы всех админов и выводит красивый список
 * @returns {Promise<string>}
 */
module.exports.getAdmins = async () => {
    const adminsResponse = await users.getAllAdmin();
    const admins = [];
    for(const user of adminsResponse){
        admins.push('@' + user.username + ' ' + user.firstname + ' ' + user.lastname);
    }
    return 'Список админов:\n' + admins.join('\n');
}

module.exports.getUserInfo = async (userId) => {
    const message = [];
    try {
        const userInfo = await users.get(userId);
        if(userInfo){
            message.push([`Выбран пользователь с id: ${userInfo.userId}`],
                [`Имя: ${userInfo.firstname} ${userInfo.lastname}`],
                [`username: ${userInfo.username}`],
                [`Открывать дверь ВЦ: ${(userInfo.opener)? "МОЖЕТ": "НЕ МОЖЕТ"}`],
                [`Заметки: ${userInfo.note}`]);
            return message.join('\n');
        }
        else{
            return `Пользователя ${userId} нет, дружочек, попробуй другой разочек`;
        }
    }catch (err)
    {
        return "Какие то проблемы с базой, дружочек, попробуй еще разочек";
    }

}