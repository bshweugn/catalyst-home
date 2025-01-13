import React, { useEffect, useState } from 'react';
import './AuthScreen.scss';

import appIcon from '../../assets/images/app-icon.webp'
import cidIcon from '../../assets/images/c-id.webp'

import TextInput from '../TextInput/TextInput';
import WideButton from '../WideButton/WideButton';
import Button from '../Button/Button';
import Description from '../Description/Description';
import { login, registerUser } from '../../logic/oauth';
import { IonSpinner } from '@ionic/react';
import { useNavigate } from 'react-router-dom';

const AuthScreen = (args) => {
    const finalClassName = 'auth-screen ' + (args.className || '')

    const [section, setSection] = useState(0);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        setSection(20);
        try {
            const token = await registerUser(username, email, password);
            args.setToken(token);
            if (token !== undefined && token !== null) {
                navigate('/');
            }
        } catch (error) {
            console.error("Ошибка при регистрации:", error);

        } finally {
            setTimeout(setSection(3), 1500);
        }
    };

    const handleLogin = async () => {
        const token = await login(email, password);
        args.setToken(token);
        if (token !== undefined && token !== null) {
            navigate('/');
        }
    };


    // useEffect(() => {

    // }, [args.token]);

    return (
        <div className={finalClassName}>
            <div className={`auth-screen__section ${section === 0 ? "auth-screen__section--visible" : ""}`}>
                <div className='auth-screen__header'>
                    <div className='auth-screen__app-icon' style={{ backgroundImage: `url(${cidIcon})` }} />
                    <h1 className='auth-screen__title'>Добро пожаловать</h1>
                    <p className='auth-screen__label'>Создайте аккаунт, чтобы получить доступ к&nbsp;управлению умным домом и&nbsp;сервисам&nbsp;Catalyst.</p>
                    <div className='auth-screen__buttons'>
                        <Button primary label="Создать аккаунт" onClick={() => setSection(1)} />
                        <Button label="Уже меня уже есть аккаунт" onClick={() => setSection(10)} />
                    </div>
                </div>
                {/* <div className='auth-screen__form'>
                    <TextInput placeholder={"Адрес электронной почты"} light />
                    <TextInput placeholder={"Пароль"} light />
                </div> */}
            </div>
            <div className={`auth-screen__section ${section === 1 ? "auth-screen__section--visible" : ""}`}>
                <div className='auth-screen__header'>
                    <div className='auth-screen__app-icon' style={{ backgroundImage: `url(${cidIcon})` }} />
                    <h1 className='auth-screen__title'>Создать аккаунт Catalyst</h1>
                    <p className='auth-screen__label'>Для начала введите адрес электронной почты. Он будет использоваться для входа в аккаунт.</p>
                    <div className='auth-screen__form'>
                        <TextInput label={"Адрес электронной почты"} placeholder={"Например, «mail@catalyst.com»"} light value={email} setValue={setEmail} />
                        {/* <TextInput label={"Адрес электронной почты"} placeholder={"Например, «mail@catalyst.com»"} light separated/> */}
                    </div>
                    <div className='auth-screen__buttons'>
                        <Button primary label="Далее" onClick={() => setSection(2)} />
                        <Button label="Назад" onClick={() => setSection(0)} />
                    </div>
                </div>
            </div>
            <div className={`auth-screen__section ${section === 2 ? "auth-screen__section--visible" : ""}`}>
                <div className='auth-screen__header'>
                    <div className='auth-screen__app-icon' style={{ backgroundImage: `url(${cidIcon})` }} />
                    <h1 className='auth-screen__title'>Создать аккаунт Catalyst</h1>
                    <p className='auth-screen__label'>Теперь придуймате надёжный пароль для входа в аккаунт.</p>
                    <div className='auth-screen__form'>
                        <TextInput password label={"Пароль"} placeholder={" "} light value={password} setValue={setPassword} />
                        <Description text="Пароль должен состоять минимум из 6 символов." />
                        {/* <TextInput password label={"Повторите пароль"} placeholder={" "} light separated /> */}
                    </div>
                    <div className='auth-screen__buttons'>
                        <Button primary label="Далее" onClick={() => setSection(3)} />
                        <Button label="Назад" onClick={() => setSection(1)} />
                    </div>
                </div>
            </div>
            <div className={`auth-screen__section ${section === 3 ? "auth-screen__section--visible" : ""}`}>
                <div className='auth-screen__header'>
                    <div className='auth-screen__app-icon' style={{ backgroundImage: `url(${cidIcon})` }} />
                    <h1 className='auth-screen__title'>Создать аккаунт Catalyst</h1>
                    <p className='auth-screen__label'>Давайте познкомимся. Как Вас зовут?</p>
                    <div className='auth-screen__form'>
                        <TextInput label={"Имя"} placeholder={" "} light value={username} setValue={setUsername} />
                    </div>
                    <div className='auth-screen__buttons'>
                        <Button primary label="Далее" onClick={() => handleRegister()} />
                        <Button label="Назад" onClick={() => setSection(2)} />
                    </div>
                </div>
            </div>
            <div className={`auth-screen__section ${section === 10 ? "auth-screen__section--visible" : ""}`}>
                <div className='auth-screen__header'>
                    <div className='auth-screen__app-icon' style={{ backgroundImage: `url(${cidIcon})` }} />
                    <h1 className='auth-screen__title'>С возвращением!</h1>
                    <p className='auth-screen__label'>Введите данные для входа в аккаунт.</p>
                    <div className='auth-screen__form'>
                        <TextInput label={"Адрес электронной почты"} placeholder={" "} light value={email} setValue={setEmail} />
                        <TextInput password label={"Пароль"} placeholder={" "} light separated value={password} setValue={setPassword} />
                    </div>
                    <div className='auth-screen__buttons'>
                        <Button primary label="Войти" onClick={() => handleLogin()} />
                        <Button label="Назад" onClick={() => setSection(0)} />
                    </div>
                </div>
            </div>

            <div className={`auth-screen__section ${section === 20 ? "auth-screen__section--visible" : ""}`}>
                <div className='auth-screen__header'>
                    <div className='auth-screen__app-icon' style={{ backgroundImage: `url(${cidIcon})` }} />
                    <h1 className='auth-screen__title'>Происходит регистрация</h1>
                    <p className='auth-screen__label'>Один момент, пожалуйста.</p>
                </div>
                <IonSpinner className={"auth-screen__spinner"}></IonSpinner>
            </div>
        </div>
    );
};

export default AuthScreen;
