interface Props {
    [key: string]: any
}

const createElement = (tag: any, props: Props, ...children: any[]) => {
    if (typeof tag === 'function') return tag(props, ...children)
    const element = document.createElement(tag)
    try {
        Object.entries(props || {}).forEach(([name, value]) => {

            if (value === null) { value = "" }

            name = name.replace('@', 'on')
            if (name === 'html') element.innerHTML = value
            else if (name === 'class') element.className += value.toString()
            else if (name.startsWith('on') && name.toLowerCase() in window)
                element.addEventListener(name.toLowerCase().substr(2), value)
            else if (name === 'style' && typeof value === 'object') {
                const styleString = Object.entries(value)
                    .map(
                        ([k, v]) =>
                            `${k.replace(
                                /[A-Z]/g,
                                (m) => '-' + m.toLowerCase()
                            )}:${(v as string).toString()}`
                    )
                    .join(';')

                element.setAttribute('style', styleString)
            } else element.setAttribute(name, value.toString())
        })
    } catch (e) {
        console.log((e as Error).message)
    }

    children.forEach((child) => {
        appendChild(element, child)
    })

    return element
}

const appendChild = (parent: any, child: any) => {
    if (Array.isArray(child))
        child.forEach((nestedChild) => appendChild(parent, nestedChild))
    else
        parent.appendChild(
            child.nodeType ? child : document.createTextNode(child)
        )
}

const createFragment = (props: any, ...children: any[]) => {
    return children
}

export {
    createElement,
    createFragment
}