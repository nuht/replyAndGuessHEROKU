import React from "react";

export function Register() {
    return (
        <div>
            <h1>S'inscrire</h1>
            <form>
                <label>
                    Name:
                    <input type="text" name="username" />
                    <input type="password" name="password" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}